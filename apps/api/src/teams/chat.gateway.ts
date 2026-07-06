import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets'
import { DefaultEventsMap, Server, Socket } from 'socket.io'
import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'
import { TeamsService } from './teams.service'
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
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server

  // Anti-flood minimal : max 10 messages / 10 s par socket.
  private readonly rateLimiter = new SocketRateLimiter()

  constructor(
    private readonly configService: ConfigService,
    private readonly teamsService: TeamsService,
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

  @SubscribeMessage('team:join')
  async handleJoin(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { teamId: string },
  ) {
    const userId = client.data.userId
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
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { teamId: string; content: string },
  ) {
    const userId = client.data.userId
    if (!userId || !data?.teamId) {
      client.emit('error', { code: 'AUTH_UNAUTHORIZED' })
      return
    }

    // Vérifié avant tout accès BDD : un socket qui flood est coupé au plus tôt.
    if (this.rateLimiter.isRateLimited(client.id)) {
      client.emit('error', { code: 'RATE_LIMITED' })
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

    if (content.length > MESSAGE_MAX_LENGTH) {
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
