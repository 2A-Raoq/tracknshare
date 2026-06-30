import { api } from '@/lib/api'
import type { AchievementItem, ApiEnvelope } from '@/types'

export const achievementsApi = {
  all: async () =>
    (await api.get<ApiEnvelope<AchievementItem[]>>('/achievements')).data.data,

  mine: async () =>
    (await api.get<ApiEnvelope<AchievementItem[]>>('/achievements/me')).data.data,
}
