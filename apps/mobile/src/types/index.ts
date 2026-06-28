// Types partagés avec l'API NestJS (réponses { success, data }).

export interface ApiEnvelope<T> {
  success: boolean
  data: T
}

export interface AuthUser {
  id: string
  email: string
  username: string
  role: string
}

export interface AuthResult {
  user: AuthUser
  accessToken: string
}

export interface PlayerStat {
  id: string
  gameName?: string
  kills: number
  deaths: number
  wins: number
  losses: number
  matchesPlayed: number
  kdRatio: number
  winrate: number
  score: number
  provider: string
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  score: number
  kdRatio: number
  winrate: number
  matchesPlayed: number
  gameName: string
}

export interface TeamSummary {
  id: string
  name: string
  tag: string
  role: string
}

export interface TeamMemberInfo {
  id: string
  username: string | null
  role: string
  joinedAt: string
}

export interface TeamStats {
  memberCount: number
  averageScore: number
  bestPlayer: { username: string; score: number } | null
}

export interface TeamDetail {
  id: string
  name: string
  tag: string
  description: string | null
  inviteCode: string
  members: TeamMemberInfo[]
  stats?: TeamStats
}

export interface ChatMessage {
  id: string
  teamId: string
  sender: { id: string; username: string | null }
  content: string
  createdAt: string
}
