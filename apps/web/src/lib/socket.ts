import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3000'

export function createAuthenticatedSocket(token: string): Socket {
  return io(SOCKET_URL, {
    auth: { token },
    autoConnect: true,
  })
}

export function createTeamSocket(token: string): Socket {
  return createAuthenticatedSocket(token)
}

export function createPrivateSocket(token: string): Socket {
  return createAuthenticatedSocket(token)
}
