export interface AuthUser {
  id: string
  email: string
  username: string
  role: string
}

export interface AuthResult {
  user: AuthUser
  accessToken: string
}
