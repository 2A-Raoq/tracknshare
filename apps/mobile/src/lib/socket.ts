import { io, Socket } from 'socket.io-client'
import { SOCKET_URL } from '@/config'

/**
 * Crée une connexion Socket.io authentifiée (même contrat que le web).
 * Événements :
 *  - team:join {teamId} / team:message:send {teamId, content} / team:message:new
 *  - conversation:join {conversationId} / private:message:send {conversationId, content} / private:message:new
 */
export function createAuthenticatedSocket(token: string): Socket {
  return io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    autoConnect: true,
  })
}
