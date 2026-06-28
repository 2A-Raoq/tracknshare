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
