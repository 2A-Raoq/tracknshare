import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import type { AuthenticatedRequest } from '../../common/types/authenticated-request'
import { MessagesService } from '../messages.service'
import type { ConversationParticipant } from '../entities/conversation-participant.entity'

type ConversationRequest = AuthenticatedRequest & {
  conversationParticipant?: ConversationParticipant
}

@Injectable()
export class ConversationParticipantGuard implements CanActivate {
  constructor(private readonly messagesService: MessagesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<ConversationRequest>()
    const userId: string | undefined = req.user?.userId
    const rawConversationId = req.params?.conversationId
    const conversationId = typeof rawConversationId === 'string' ? rawConversationId : undefined

    if (!userId || !conversationId) {
      throw new ForbiddenException('CONVERSATION_PARTICIPANT_REQUIRED')
    }

    const participant = await this.messagesService.getParticipantOrThrow(conversationId, userId)
    req.conversationParticipant = participant
    return true
  }
}
