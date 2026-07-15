import { Body, Controller, Get, Patch, Post, Req, UseGuards, Param } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import type { AuthenticatedRequest } from '../common/types/authenticated-request'
import { MessagesService } from './messages.service'
import { CreateConversationDto } from './dto/create-conversation.dto'
import { SendPrivateMessageDto } from './dto/send-private-message.dto'
import { ConversationParticipantGuard } from './guards/conversation-participant.guard'

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'List my private conversations' })
  @ApiUnauthorizedResponse({ description: 'JWT missing or invalid' })
  async getConversations(@Req() req: AuthenticatedRequest) {
    const conversations = await this.messagesService.listConversations(req.user.userId)
    return { success: true, data: conversations }
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Create or reuse a direct conversation' })
  @ApiBody({ type: CreateConversationDto })
  @ApiUnauthorizedResponse({ description: 'JWT missing or invalid' })
  @ApiNotFoundResponse({ description: 'Recipient not found' })
  async createConversation(@Req() req: AuthenticatedRequest, @Body() dto: CreateConversationDto) {
    const conversation = await this.messagesService.createDirectConversation(
      req.user.userId,
      dto.recipientId,
    )
    return { success: true, data: conversation }
  }

  @Get('conversations/:conversationId/messages')
  @UseGuards(ConversationParticipantGuard)
  @ApiOperation({ summary: 'Get messages from a private conversation' })
  @ApiUnauthorizedResponse({ description: 'JWT missing or invalid' })
  @ApiForbiddenResponse({ description: 'User is not a participant' })
  @ApiNotFoundResponse({ description: 'Conversation not found' })
  async getConversationMessages(
    @Req() req: AuthenticatedRequest,
    @Param('conversationId') conversationId: string,
  ) {
    const data = await this.messagesService.getConversationMessages(conversationId, req.user.userId)
    return { success: true, data }
  }

  @Post('conversations/:conversationId/messages')
  @UseGuards(ConversationParticipantGuard)
  @ApiOperation({ summary: 'Send a private message in a conversation' })
  @ApiBody({ type: SendPrivateMessageDto })
  @ApiUnauthorizedResponse({ description: 'JWT missing or invalid' })
  @ApiForbiddenResponse({ description: 'User is not a participant' })
  @ApiNotFoundResponse({ description: 'Conversation not found' })
  async sendMessage(
    @Req() req: AuthenticatedRequest,
    @Param('conversationId') conversationId: string,
    @Body() dto: SendPrivateMessageDto,
  ) {
    const message = await this.messagesService.sendMessage(
      conversationId,
      req.user.userId,
      dto.content,
    )
    return { success: true, data: message }
  }

  @Patch('conversations/:conversationId/read')
  @UseGuards(ConversationParticipantGuard)
  @ApiOperation({ summary: 'Mark a private conversation as read' })
  @ApiUnauthorizedResponse({ description: 'JWT missing or invalid' })
  @ApiForbiddenResponse({ description: 'User is not a participant' })
  @ApiNotFoundResponse({ description: 'Conversation not found' })
  async markConversationAsRead(
    @Req() req: AuthenticatedRequest,
    @Param('conversationId') conversationId: string,
  ) {
    const result = await this.messagesService.markConversationAsRead(
      conversationId,
      req.user.userId,
    )
    return { success: true, data: result }
  }
}
