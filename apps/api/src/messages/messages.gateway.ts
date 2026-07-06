import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { DefaultEventsMap, Server, Socket } from 'socket.io'
import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'
import { MessagesService } from './messages.service'
import { getCorsOrigins } from '../common/config/cors'
import { MESSAGE_MAX_LENGTH } from '../common/constants'
import { SocketRateLimiter } from '../common/websockets/socket-rate-limiter'

interface SocketData {
  userId?: string
}

type AuthenticatedSocket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>

interface JwtPayload {
  sub: string
  role: string
}

@WebSocketGateway({
  cors: {
    origin: getCorsOrigins(),
    credentials: true,
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server

  // Anti-flood minimal : max 10 messages / 10 s par socket.
  private readonly rateLimiter = new SocketRateLimiter()

  constructor(
    private readonly configService: ConfigService,
    private readonly messagesService: MessagesService,
  ) {}

  handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth?.token as string | undefined
      if (!token) {
        client.disconnect()
        return
      }

      const secret = this.configService.getOrThrow<string>('JWT_SECRET')
      const payload = jwt.verify(token, secret) as JwtPayload
      client.data.userId = payload.sub
    } catch {
      client.disconnect()
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.rateLimiter.clear(client.id)
  }

  @SubscribeMessage('conversation:join')
  async handleJoin(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data.userId
    const conversationId = data?.conversationId

    if (!userId || !conversationId) {
      client.emit('error', { code: 'AUTH_UNAUTHORIZED' })
      return
    }

    const isParticipant = await this.messagesService.isParticipant(conversationId, userId)
    if (!isParticipant) {
      client.emit('error', { code: 'CONVERSATION_PARTICIPANT_REQUIRED' })
      return
    }

    await client.join(`conversation:${conversationId}`)
  }

  @SubscribeMessage('private:message:send')
  async handlePrivateMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    const userId = client.data.userId
    const conversationId = data?.conversationId

    if (!userId || !conversationId) {
      client.emit('error', { code: 'AUTH_UNAUTHORIZED' })
      return
    }

    // Vérifié avant tout accès BDD : un socket qui flood est coupé au plus tôt.
    if (this.rateLimiter.isRateLimited(client.id)) {
      client.emit('error', { code: 'RATE_LIMITED' })
      return
    }

    const isParticipant = await this.messagesService.isParticipant(conversationId, userId)
    if (!isParticipant) {
      client.emit('error', { code: 'CONVERSATION_PARTICIPANT_REQUIRED' })
      return
    }

    const trimmed = data.content?.trim() ?? ''
    if (!trimmed) {
      client.emit('error', { code: 'PRIVATE_MESSAGE_EMPTY' })
      return
    }

    if (trimmed.length > MESSAGE_MAX_LENGTH) {
      client.emit('error', { code: 'PRIVATE_MESSAGE_TOO_LONG' })
      return
    }

    const message = await this.messagesService.sendMessage(conversationId, userId, trimmed)
    this.server.to(`conversation:${conversationId}`).emit('private:message:new', message)
  }
}
