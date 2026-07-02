import { api } from '@/lib/api'
import type { ApiEnvelope, AuthResult, AuthUser } from '@/types'

export const authApi = {
  login: async (email: string, password: string) =>
    (await api.post<ApiEnvelope<AuthResult>>('/auth/login', { email, password }))
      .data.data,

  register: async (email: string, username: string, password: string) =>
    (
      await api.post<ApiEnvelope<AuthResult>>('/auth/register', {
        email,
        username,
        password,
      })
    ).data.data,

  me: async () => (await api.get<ApiEnvelope<AuthUser>>('/users/me')).data.data,
}
