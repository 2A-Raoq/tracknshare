import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UsersService } from '../users/users.service'
import { FriendRequest, FriendRequestStatus } from './entities/friend-request.entity'

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepo: Repository<FriendRequest>,
    private readonly usersService: UsersService,
  ) {}

  async listFriends(userId: string) {
    const requests = await this.friendRequestRepo.find({
      where: [
        { senderId: userId, status: FriendRequestStatus.ACCEPTED },
        { recipientId: userId, status: FriendRequestStatus.ACCEPTED },
      ],
      relations: ['sender', 'recipient'],
      order: { createdAt: 'DESC' },
    })

    return requests
      .map((request) => {
        const friend = request.senderId === userId ? request.recipient : request.sender
        if (!friend?.id || !friend?.username) {
          return null
        }
        return this.toPublicFriend(friend.id, friend.username)
      })
      .filter((friend): friend is { id: string; username: string; avatar: null } => !!friend)
  }

  async listPendingRequests(userId: string) {
    const [incoming, outgoing] = await Promise.all([
      this.friendRequestRepo.find({
        where: { recipientId: userId, status: FriendRequestStatus.PENDING },
        relations: ['sender', 'recipient'],
        order: { createdAt: 'DESC' },
      }),
      this.friendRequestRepo.find({
        where: { senderId: userId, status: FriendRequestStatus.PENDING },
        relations: ['sender', 'recipient'],
        order: { createdAt: 'DESC' },
      }),
    ])

    return {
      incoming: incoming
        .map((request) => {
          if (!request.sender?.id || !request.sender?.username) {
            return null
          }

          return {
            id: request.id,
            status: request.status,
            createdAt: request.createdAt,
            senderId: request.senderId,
            recipientId: request.recipientId,
            user: this.toPublicFriend(request.sender.id, request.sender.username),
          }
        })
        .filter((request): request is NonNullable<typeof request> => request !== null),
      outgoing: outgoing
        .map((request) => {
          if (!request.recipient?.id || !request.recipient?.username) {
            return null
          }

          return {
            id: request.id,
            status: request.status,
            createdAt: request.createdAt,
            senderId: request.senderId,
            recipientId: request.recipientId,
            user: this.toPublicFriend(request.recipient.id, request.recipient.username),
          }
        })
        .filter((request): request is NonNullable<typeof request> => request !== null),
    }
  }

  async createRequest(senderId: string, recipientId: string) {
    if (senderId === recipientId) {
      throw new BadRequestException('FRIEND_REQUEST_SELF_FORBIDDEN')
    }

    await this.usersService.getPublicById(recipientId)

    const existing = await this.findRelationship(senderId, recipientId)
    if (existing?.status === FriendRequestStatus.PENDING) {
      throw new ConflictException('FRIEND_REQUEST_ALREADY_PENDING')
    }
    if (existing?.status === FriendRequestStatus.ACCEPTED) {
      throw new ConflictException('FRIENDSHIP_ALREADY_EXISTS')
    }

    const request = await this.friendRequestRepo.save(
      this.friendRequestRepo.create({
        senderId,
        recipientId,
        status: FriendRequestStatus.PENDING,
        respondedAt: null,
      }),
    )

    const fullRequest = await this.friendRequestRepo.findOne({
      where: { id: request.id },
      relations: ['recipient'],
    })

    if (!fullRequest) {
      throw new NotFoundException('FRIEND_REQUEST_NOT_FOUND')
    }

    return {
      id: fullRequest.id,
      status: fullRequest.status,
      createdAt: fullRequest.createdAt,
      senderId: fullRequest.senderId,
      recipientId: fullRequest.recipientId,
      user: this.toPublicFriend(fullRequest.recipient.id, fullRequest.recipient.username),
    }
  }

  async acceptRequest(requestId: string, userId: string) {
    const request = await this.friendRequestRepo.findOne({
      where: { id: requestId },
      relations: ['sender'],
    })

    if (!request) {
      throw new NotFoundException('FRIEND_REQUEST_NOT_FOUND')
    }
    if (request.recipientId !== userId) {
      throw new ForbiddenException('FRIEND_REQUEST_RECIPIENT_REQUIRED')
    }
    if (request.status !== FriendRequestStatus.PENDING) {
      throw new ConflictException('FRIEND_REQUEST_NOT_PENDING')
    }

    request.status = FriendRequestStatus.ACCEPTED
    request.respondedAt = new Date()
    await this.friendRequestRepo.save(request)

    return {
      id: request.id,
      status: request.status,
      respondedAt: request.respondedAt,
      user: this.toPublicFriend(request.sender.id, request.sender.username),
    }
  }

  async refuseRequest(requestId: string, userId: string) {
    const request = await this.friendRequestRepo.findOne({
      where: { id: requestId },
      relations: ['sender'],
    })

    if (!request) {
      throw new NotFoundException('FRIEND_REQUEST_NOT_FOUND')
    }
    if (request.recipientId !== userId) {
      throw new ForbiddenException('FRIEND_REQUEST_RECIPIENT_REQUIRED')
    }
    if (request.status !== FriendRequestStatus.PENDING) {
      throw new ConflictException('FRIEND_REQUEST_NOT_PENDING')
    }

    request.status = FriendRequestStatus.REFUSED
    request.respondedAt = new Date()
    await this.friendRequestRepo.save(request)

    return {
      id: request.id,
      status: request.status,
      respondedAt: request.respondedAt,
    }
  }

  async cancelRequest(requestId: string, userId: string) {
    const request = await this.friendRequestRepo.findOne({
      where: { id: requestId },
      relations: ['recipient'],
    })

    if (!request) {
      throw new NotFoundException('FRIEND_REQUEST_NOT_FOUND')
    }
    if (request.senderId !== userId) {
      throw new ForbiddenException('FRIEND_REQUEST_SENDER_REQUIRED')
    }
    if (request.status !== FriendRequestStatus.PENDING) {
      throw new ConflictException('FRIEND_REQUEST_NOT_PENDING')
    }

    request.status = FriendRequestStatus.CANCELLED
    request.respondedAt = new Date()
    await this.friendRequestRepo.save(request)

    return {
      id: request.id,
      status: request.status,
      respondedAt: request.respondedAt,
    }
  }

  async removeFriend(userId: string, friendId: string) {
    const request = await this.findRelationship(userId, friendId)

    if (!request || request.status !== FriendRequestStatus.ACCEPTED) {
      throw new NotFoundException('FRIENDSHIP_NOT_FOUND')
    }

    request.status = FriendRequestStatus.CANCELLED
    request.respondedAt = new Date()
    await this.friendRequestRepo.save(request)

    return {
      friendId,
      removed: true,
    }
  }

  private async findRelationship(userAId: string, userBId: string) {
    return this.friendRequestRepo.findOne({
      where: [
        { senderId: userAId, recipientId: userBId },
        { senderId: userBId, recipientId: userAId },
      ],
      order: { createdAt: 'DESC' },
    })
  }

  private toPublicFriend(id: string, username: string) {
    return {
      id,
      username,
      avatar: null,
    }
  }
}
