import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'
import { MessagesService } from './messages.service'

interface JwtPayload {
  sub: string
  role: string
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server

  constructor(
    private readonly configService: ConfigService,
    private readonly messagesService: MessagesService,
  ) {}

  handleConnection(client: Socket) {
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

  handleDisconnect(_client: Socket) {}

  @SubscribeMessage('conversation:join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data.userId as string | undefined
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
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    const userId = client.data.userId as string | undefined
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

    const trimmed = data.content?.trim() ?? ''
    if (!trimmed) {
      client.emit('error', { code: 'PRIVATE_MESSAGE_EMPTY' })
      return
    }

    if (trimmed.length > 1000) {
      client.emit('error', { code: 'PRIVATE_MESSAGE_TOO_LONG' })
      return
    }

    const message = await this.messagesService.sendMessage(conversationId, userId, trimmed)
    this.server.to(`conversation:${conversationId}`).emit('private:message:new', message)
  }
}
