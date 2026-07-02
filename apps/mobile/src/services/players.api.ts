import { api } from '@/lib/api'
import type { ApiEnvelope, PublicPlayerProfile } from '@/types'

export const playersApi = {
  getProfile: async (username: string) =>
    (
      await api.get<ApiEnvelope<PublicPlayerProfile>>(
        `/players/${encodeURIComponent(username)}`,
      )
    ).data.data,
}
