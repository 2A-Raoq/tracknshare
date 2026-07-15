import { api } from '@/lib/api'
import type { AchievementItem, ApiEnvelope } from '@/types'

export const achievementsApi = {
  mine: async () =>
    (await api.get<ApiEnvelope<AchievementItem[]>>('/achievements/me')).data.data,
}
