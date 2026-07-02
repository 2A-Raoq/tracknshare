import { api } from '@/lib/api'
import type { ApiEnvelope, LeaderboardEntry } from '@/types'

export const leaderboardApi = {
  solo: async () =>
    (
      await api.get<ApiEnvelope<{ entries: LeaderboardEntry[] }>>(
        '/leaderboards/solo',
      )
    ).data.data.entries,
}
