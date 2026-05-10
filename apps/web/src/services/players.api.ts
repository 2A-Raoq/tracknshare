import { api } from './api'
import type { PublicPlayerProfile } from '../types/players'

function isStats(value: unknown): value is PublicPlayerProfile['stats'] {
  if (value === null) {
    return true
  }

  const record = value as Record<string, unknown>
  return (
    !!value
    && typeof value === 'object'
    && typeof record.score === 'number'
    && typeof record.kdRatio === 'number'
    && typeof record.winrate === 'number'
    && typeof record.matchesPlayed === 'number'
    && typeof record.wins === 'number'
    && typeof record.losses === 'number'
    && typeof record.kills === 'number'
    && typeof record.deaths === 'number'
  )
}

function isGame(value: unknown): value is PublicPlayerProfile['primaryGame'] {
  if (value === null) {
    return true
  }

  const record = value as Record<string, unknown>
  return (
    !!value
    && typeof value === 'object'
    && typeof record.id === 'string'
    && typeof record.name === 'string'
    && typeof record.slug === 'string'
  )
}

function isSeason(value: unknown): value is PublicPlayerProfile['activeSeason'] {
  if (value === null) {
    return true
  }

  const record = value as Record<string, unknown>
  return (
    !!value
    && typeof value === 'object'
    && typeof record.id === 'string'
    && typeof record.name === 'string'
    && typeof record.status === 'string'
  )
}

function ensureTeams(value: unknown): PublicPlayerProfile['teams'] {
  if (!Array.isArray(value)) {
    throw new Error('Invalid public player profile response: expected teams array.')
  }

  return value.map((item) => {
    const record = item as Record<string, unknown>
    if (
      !item
      || typeof item !== 'object'
      || typeof record.id !== 'string'
      || typeof record.name !== 'string'
      || typeof record.tag !== 'string'
      || typeof record.role !== 'string'
    ) {
      throw new Error('Invalid public player profile response: malformed team item.')
    }

    return {
      id: record.id,
      name: record.name,
      tag: record.tag,
      role: record.role,
    }
  })
}

function ensureBadges(value: unknown): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error('Invalid public player profile response: expected badge array.')
  }

  return value
}

function ensureProfile(payload: unknown): PublicPlayerProfile {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid public player profile response.')
  }

  const record = payload as Record<string, unknown>

  if (
    typeof record.id !== 'string'
    || typeof record.username !== 'string'
    || (typeof record.avatar !== 'string' && record.avatar !== null)
    || (typeof record.bio !== 'string' && record.bio !== null)
    || typeof record.memberSince !== 'string'
    || (typeof record.leaderboardRank !== 'number' && record.leaderboardRank !== null)
    || !isStats(record.stats)
    || !isGame(record.primaryGame)
    || !isSeason(record.activeSeason)
  ) {
    throw new Error('Invalid public player profile response: malformed profile.')
  }

  return {
    id: record.id,
    username: record.username,
    avatar: record.avatar,
    bio: record.bio,
    memberSince: record.memberSince,
    stats: record.stats,
    leaderboardRank: record.leaderboardRank,
    primaryGame: record.primaryGame,
    activeSeason: record.activeSeason,
    teams: ensureTeams(record.teams),
    badges: ensureBadges(record.badges),
  }
}

export const playersApi = {
  getPublicProfile: async (username: string): Promise<PublicPlayerProfile> => {
    const res = await api.get<{ success: boolean; data: PublicPlayerProfile }>(
      `/players/${encodeURIComponent(username)}`,
    )
    return ensureProfile(res.data?.data)
  },
}
