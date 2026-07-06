import { api } from './api'
import type { PlayerStatsData, LeaderboardData, LeaderboardEntry } from '../types/stats'

function isPlayerStatsData(value: unknown): value is PlayerStatsData {
  const record = value as Record<string, unknown>
  return (
    !!value
    && typeof value === 'object'
    && typeof record.id === 'string'
    && typeof record.kills === 'number'
    && typeof record.deaths === 'number'
    && typeof record.wins === 'number'
    && typeof record.losses === 'number'
    && typeof record.matchesPlayed === 'number'
    && typeof record.playtimeMinutes === 'number'
    && typeof record.kdRatio === 'number'
    && typeof record.winrate === 'number'
    && typeof record.score === 'number'
  )
}

function ensurePlayerStatsArray(payload: unknown): PlayerStatsData[] {
  if (!Array.isArray(payload)) {
    throw new Error('Invalid stats response: expected an array.')
  }

  return payload.map((item) => {
    if (!isPlayerStatsData(item)) {
      throw new Error('Invalid stats response: malformed stats item.')
    }
    return item
  })
}

function isLeaderboardEntry(value: unknown): value is LeaderboardEntry {
  const record = value as Record<string, unknown>
  return (
    !!value
    && typeof value === 'object'
    && typeof record.rank === 'number'
    && typeof record.userId === 'string'
    && typeof record.username === 'string'
    && typeof record.score === 'number'
  )
}

function ensureLeaderboardData(payload: unknown): LeaderboardData {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid leaderboard response.')
  }

  const record = payload as Record<string, unknown>

  if (
    !Array.isArray(record.entries)
    || typeof record.total !== 'number'
    || typeof record.page !== 'number'
    || typeof record.limit !== 'number'
  ) {
    throw new Error('Invalid leaderboard response: malformed pagination payload.')
  }

  return {
    entries: record.entries.map((item) => {
      if (!isLeaderboardEntry(item)) {
        throw new Error('Invalid leaderboard response: malformed leaderboard entry.')
      }
      return item
    }),
    total: record.total,
    page: record.page,
    limit: record.limit,
  }
}

export async function getMyStats(): Promise<PlayerStatsData[]> {
  const res = await api.get('/stats/me')
  return ensurePlayerStatsArray(res.data?.data)
}

export async function syncStats(): Promise<PlayerStatsData> {
  const res = await api.post('/stats/sync', {})
  return res.data.data
}

export async function syncSteamStats(): Promise<PlayerStatsData[]> {
  const res = await api.post('/stats/sync/steam')
  return Array.isArray(res.data?.data) ? res.data.data : []
}

export async function getSoloLeaderboard(params?: {
  gameId?: string
  seasonId?: string
  page?: number
  limit?: number
}): Promise<LeaderboardData> {
  const res = await api.get('/leaderboards/solo', { params })
  return ensureLeaderboardData(res.data?.data)
}
