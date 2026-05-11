import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'
import { TeamsService } from './teams.service'

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
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server

  constructor(
    private readonly configService: ConfigService,
    private readonly teamsService: TeamsService,
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

  @SubscribeMessage('team:join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { teamId: string },
  ) {
    const userId = client.data.userId as string | undefined
    if (!userId || !data?.teamId) {
      client.emit('error', { code: 'AUTH_UNAUTHORIZED' })
      return
    }

    const isMember = await this.teamsService.isMember(data.teamId, userId)
    if (!isMember) {
      client.emit('error', { code: 'TEAM_MEMBER_REQUIRED' })
      return
    }

    await client.join(`team:${data.teamId}`)
  }

  @SubscribeMessage('team:message:send')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { teamId: string; content: string },
  ) {
    const userId = client.data.userId as string | undefined
    if (!userId || !data?.teamId) {
      client.emit('error', { code: 'AUTH_UNAUTHORIZED' })
      return
    }

    const isMember = await this.teamsService.isMember(data.teamId, userId)
    if (!isMember) {
      client.emit('error', { code: 'TEAM_MEMBER_REQUIRED' })
      return
    }

    const content = data.content?.trim() ?? ''
    if (!content) {
      client.emit('error', { code: 'CHAT_MESSAGE_EMPTY' })
      return
    }

    if (content.length > 1000) {
      client.emit('error', { code: 'CHAT_MESSAGE_TOO_LONG' })
      return
    }

    const msg = await this.teamsService.saveMessage(data.teamId, userId, { content })

    this.server.to(`team:${data.teamId}`).emit('team:message:new', {
      id: msg.id,
      teamId: msg.teamId,
      sender: { id: msg.senderId, username: msg.sender?.username ?? null },
      content: msg.content,
      createdAt: msg.createdAt,
    })
  }
}
