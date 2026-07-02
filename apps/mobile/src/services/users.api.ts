import { api } from '@/lib/api'
import type { ApiEnvelope, AuthUser } from '@/types'

export const usersApi = {
  updateProfile: async (data: { username: string }) =>
    (await api.patch<ApiEnvelope<AuthUser>>('/users/me', data)).data.data,

  exportMyData: async () =>
    (await api.get<ApiEnvelope<unknown>>('/users/me/export')).data.data,

  deleteAccount: async () => {
    await api.delete('/users/me')
  },
}
