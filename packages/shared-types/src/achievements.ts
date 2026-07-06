export interface AchievementItem {
  id: string
  code: string
  name: string
  description: string
  icon?: string
  iconKey?: string
  points: number
  category?: string
  targetValue?: number
  currentValue?: number
  progressPercent?: number
  unlocked?: boolean
  unlockedAt?: string | null
  createdAt?: string
}
