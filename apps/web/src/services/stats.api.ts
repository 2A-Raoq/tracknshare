import { api } from './api'
import type { PlayerStatsData, LeaderboardData } from '../types/stats'

export async function getMyStats(): Promise<PlayerStatsData[]> {
  const res = await api.get('/stats/me')
  return res.data.data
}

export async function syncStats(gameId?: string): Promise<PlayerStatsData> {
  const res = await api.post('/stats/sync', gameId ? { gameId } : {})
  return res.data.data
}

export async function getSoloLeaderboard(params?: {
  gameId?: string
  seasonId?: string
  page?: number
  limit?: number
}): Promise<LeaderboardData> {
  const res = await api.get('/leaderboards/solo', { params })
  return res.data.data
}
