import { api } from './api'
import type { AchievementItem } from '../types/achievements'

function isAchievementItem(value: unknown): value is AchievementItem {
  const record = value as Record<string, unknown>
  return (
    !!value
    && typeof value === 'object'
    && typeof record.id === 'string'
    && typeof record.code === 'string'
    && typeof record.name === 'string'
    && typeof record.description === 'string'
    && typeof record.icon === 'string'
    && typeof record.points === 'number'
    && (typeof record.createdAt === 'string' || typeof record.createdAt === 'undefined')
    && (typeof record.unlockedAt === 'string' || typeof record.unlockedAt === 'undefined')
  )
}

function ensureAchievementArray(payload: unknown): AchievementItem[] {
  if (!Array.isArray(payload)) {
    throw new Error('Invalid achievements response: expected an array.')
  }

  return payload.map((item) => {
    if (!isAchievementItem(item)) {
      throw new Error('Invalid achievements response: malformed badge item.')
    }
    return item
  })
}

export const achievementsApi = {
  getAchievements: async (): Promise<AchievementItem[]> => {
    const res = await api.get<{ success: boolean; data: AchievementItem[] }>('/achievements')
    return ensureAchievementArray(res.data?.data)
  },

  getMyAchievements: async (): Promise<AchievementItem[]> => {
    const res = await api.get<{ success: boolean; data: AchievementItem[] }>('/achievements/me')
    return ensureAchievementArray(res.data?.data)
  },
}
