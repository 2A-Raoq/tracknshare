import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Conversation, ConversationType } from './entities/conversation.entity'
import { ConversationParticipant } from './entities/conversation-participant.entity'
import { PrivateMessage } from './entities/private-message.entity'
import { UsersService } from '../users/users.service'
import { EncryptionService } from '../security/encryption.service'

const UNAVAILABLE_MESSAGE_CONTENT = 'Message indisponible'

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(ConversationParticipant)
    private readonly participantRepo: Repository<ConversationParticipant>,
    @InjectRepository(PrivateMessage)
    private readonly privateMessageRepo: Repository<PrivateMessage>,
    private readonly usersService: UsersService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async listConversations(userId: string) {
    const participations = await this.participantRepo.find({
      where: { userId },
      relations: ['conversation', 'conversation.participants', 'conversation.participants.user'],
      order: { createdAt: 'DESC' },
    })

    const conversationIds = participations.map((participant) => participant.conversationId)
    const lastMessages = await this.findLastMessagesByConversationIds(conversationIds)

    return participations
      .map((participant) => this.toConversationSummary(participant, lastMessages))
      .sort((left, right) => {
        const leftDate = left.lastMessage?.createdAt ?? left.updatedAt
        const rightDate = right.lastMessage?.createdAt ?? right.updatedAt
        return new Date(rightDate).getTime() - new Date(leftDate).getTime()
      })
  }

  async createDirectConversation(userId: string, recipientId: string) {
    if (recipientId === userId) {
      throw new BadRequestException('CONVERSATION_RECIPIENT_INVALID')
    }

    await this.usersService.getPublicById(recipientId)

    const existing = await this.findExistingDirectConversation(userId, recipientId)
    if (existing) {
      return this.getConversationSummary(existing.id, userId)
    }

    const conversation = await this.conversationRepo.save(
      this.conversationRepo.create({
        type: ConversationType.DIRECT,
      }),
    )

    await this.participantRepo.save([
      this.participantRepo.create({
        conversationId: conversation.id,
        userId,
        lastReadAt: new Date(),
      }),
      this.participantRepo.create({
        conversationId: conversation.id,
        userId: recipientId,
        lastReadAt: null,
      }),
    ])

    return this.getConversationSummary(conversation.id, userId)
  }

  async getConversationSummary(conversationId: string, userId: string) {
    const participant = await this.getParticipantOrThrow(conversationId, userId)
    const lastMessages = await this.findLastMessagesByConversationIds([conversationId])
    return this.toConversationSummary(participant, lastMessages)
  }

  async getConversationMessages(conversationId: string, userId: string) {
    const participant = await this.getParticipantOrThrow(conversationId, userId)
    const messages = await this.createMessageQueryBuilder()
      .where('message.conversationId = :conversationId', { conversationId })
      .andWhere('message.deletedAt IS NULL')
      .orderBy('message.createdAt', 'ASC')
      .getMany()

    const otherParticipant = participant.conversation.participants.find(
      (entry) => entry.userId !== userId,
    )

    return {
      conversationId,
      participant: otherParticipant
        ? {
            id: otherParticipant.userId,
            username: otherParticipant.user?.username ?? null,
            avatar: null,
          }
        : null,
      items: messages.map((message) => this.toPrivateMessagePayload(message)),
    }
  }

  async sendMessage(conversationId: string, senderId: string, content: string) {
    await this.getParticipantOrThrow(conversationId, senderId)

    const trimmed = content.trim()
    if (!trimmed) {
      throw new BadRequestException('PRIVATE_MESSAGE_EMPTY')
    }

    if (trimmed.length > 1000) {
      throw new BadRequestException('PRIVATE_MESSAGE_TOO_LONG')
    }

    const encrypted = this.encryptionService.encrypt(trimmed)
    const message = await this.privateMessageRepo.save(
      this.privateMessageRepo.create({
        conversationId,
        senderId,
        content: null,
        encryptedContent: encrypted.ciphertext,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        editedAt: null,
        deletedAt: null,
      }),
    )

    await this.conversationRepo.update(conversationId, { updatedAt: new Date() })

    const fullMessage = await this.createMessageQueryBuilder()
      .where('message.id = :id', { id: message.id })
      .getOne()

    if (!fullMessage) {
      throw new NotFoundException('PRIVATE_MESSAGE_NOT_FOUND')
    }

    return this.toPrivateMessagePayload(fullMessage)
  }

  async markConversationAsRead(conversationId: string, userId: string) {
    const participant = await this.getParticipantOrThrow(conversationId, userId)
    participant.lastReadAt = new Date()
    await this.participantRepo.save(participant)
    return {
      conversationId,
      lastReadAt: participant.lastReadAt,
    }
  }

  async getParticipantOrThrow(conversationId: string, userId: string) {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
      relations: ['participants', 'participants.user'],
    })

    if (!conversation) {
      throw new NotFoundException('CONVERSATION_NOT_FOUND')
    }

    const participant = conversation.participants.find((entry) => entry.userId === userId)
    if (!participant) {
      throw new ForbiddenException('CONVERSATION_PARTICIPANT_REQUIRED')
    }

    participant.conversation = conversation
    return participant
  }

  async isParticipant(conversationId: string, userId: string): Promise<boolean> {
    const participant = await this.participantRepo.findOne({
      where: { conversationId, userId },
    })
    return !!participant
  }

  private async findExistingDirectConversation(userId: string, recipientId: string) {
    const participations = await this.participantRepo.find({
      where: { userId },
      relations: ['conversation', 'conversation.participants'],
    })

    return participations
      .map((participant) => participant.conversation)
      .find(
        (conversation) =>
          conversation.type === ConversationType.DIRECT
          && conversation.participants.length === 2
          && conversation.participants.some((participant) => participant.userId === recipientId),
      )
  }

  private async findLastMessagesByConversationIds(conversationIds: string[]) {
    if (conversationIds.length === 0) {
      return new Map<string, PrivateMessage>()
    }

    const messages = await this.createMessageQueryBuilder()
      .where('message.conversationId IN (:...conversationIds)', { conversationIds })
      .andWhere('message.deletedAt IS NULL')
      .orderBy('message.createdAt', 'DESC')
      .getMany()

    const lastMessages = new Map<string, PrivateMessage>()
    for (const message of messages) {
      if (!lastMessages.has(message.conversationId)) {
        lastMessages.set(message.conversationId, message)
      }
    }

    return lastMessages
  }

  private toConversationSummary(
    participant: ConversationParticipant,
    lastMessages: Map<string, PrivateMessage>,
  ) {
    const otherParticipant = participant.conversation.participants.find(
      (entry) => entry.userId !== participant.userId,
    )
    const lastMessage = lastMessages.get(participant.conversationId)

    return {
      id: participant.conversation.id,
      type: participant.conversation.type,
      participant: otherParticipant
        ? {
            id: otherParticipant.userId,
            username: otherParticipant.user?.username ?? null,
            avatar: null,
          }
        : null,
      lastMessage: lastMessage ? this.toPrivateMessagePreview(lastMessage) : null,
      updatedAt: participant.conversation.updatedAt,
      createdAt: participant.conversation.createdAt,
      lastReadAt: participant.lastReadAt,
    }
  }

  private toPrivateMessagePreview(message: PrivateMessage) {
    return {
      id: message.id,
      senderId: message.senderId,
      content: this.getDecryptedContent(message),
      createdAt: message.createdAt,
    }
  }

  private toPrivateMessagePayload(message: PrivateMessage) {
    return {
      id: message.id,
      conversationId: message.conversationId,
      sender: {
        id: message.senderId,
        username: message.sender?.username ?? null,
      },
      content: this.getDecryptedContent(message),
      createdAt: message.createdAt,
      editedAt: message.editedAt,
      deletedAt: message.deletedAt,
    }
  }

  private getDecryptedContent(message: PrivateMessage): string {
    try {
      if (message.encryptedContent && message.iv && message.authTag) {
        return this.encryptionService.decrypt({
          ciphertext: message.encryptedContent,
          iv: message.iv,
          authTag: message.authTag,
        })
      }

      if (message.content) {
        return message.content
      }
    } catch {
      return UNAVAILABLE_MESSAGE_CONTENT
    }

    return UNAVAILABLE_MESSAGE_CONTENT
  }

  private createMessageQueryBuilder() {
    return this.privateMessageRepo
      .createQueryBuilder('message')
      .addSelect([
        'message.content',
        'message.encryptedContent',
        'message.iv',
        'message.authTag',
      ])
      .leftJoinAndSelect('message.sender', 'sender')
  }
}
