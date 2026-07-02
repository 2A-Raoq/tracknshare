import { api } from '@/lib/api'
import type { ApiEnvelope, PlayerStat } from '@/types'

export const statsApi = {
  mine: async () =>
    (await api.get<ApiEnvelope<PlayerStat[]>>('/stats/me')).data.data,
}
