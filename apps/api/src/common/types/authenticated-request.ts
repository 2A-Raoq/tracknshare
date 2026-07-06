import type { Request } from 'express'

/**
 * Payload attaché à `req.user` par la JwtStrategy après validation du token.
 */
export interface AuthenticatedUser {
  userId: string
  role: string
}

/**
 * Requête HTTP passée par le JwtAuthGuard : `user` est garanti présent.
 */
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser
}
