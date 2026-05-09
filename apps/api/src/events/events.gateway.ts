import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets'

import { Server, Socket } from 'socket.io'
import * as cookie from 'cookie'
import * as jwt from 'jsonwebtoken'

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server

  handleConnection(client: Socket) {
    try {
      // 1. lire cookies handshake
      const cookies = cookie.parse(
        client.handshake.headers.cookie || '',
      )

      const token = cookies.access_token

      if (!token) {
        console.log('No token → disconnect')
        client.disconnect()
        return
      }

      // 2. vérifier JWT
      const payload = jwt.verify(token, 'secret') as any

      // 3. attacher user au socket
      client.data.user = {
        id: payload.sub,
        email: payload.email,
      }

      console.log(
        `User connected: ${payload.email} (${payload.sub})`,
      )

      console.log('Socket id:', client.id)
    } catch (err) {
      console.log('Invalid token → disconnect')
      client.disconnect()
    }
  }
}