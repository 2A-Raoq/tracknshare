export interface AchievementItem {
  id: string
  code: string
  name: string
  description: string
  icon: string
  points: number
  createdAt?: string
  unlockedAt?: string
}
