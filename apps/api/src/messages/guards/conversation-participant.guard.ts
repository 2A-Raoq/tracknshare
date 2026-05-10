import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { MessagesService } from '../messages.service'

@Injectable()
export class ConversationParticipantGuard implements CanActivate {
  constructor(private readonly messagesService: MessagesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const userId: string | undefined = req.user?.userId
    const conversationId: string | undefined = req.params?.conversationId

    if (!userId || !conversationId) {
      throw new ForbiddenException('CONVERSATION_PARTICIPANT_REQUIRED')
    }

    const participant = await this.messagesService.getParticipantOrThrow(conversationId, userId)
    req.conversationParticipant = participant
    return true
  }
}
