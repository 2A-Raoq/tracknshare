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

// --- Amis ---
export interface FriendUser {
  id: string
  username: string
  avatar: string | null
}

export interface FriendRequestItem {
  id: string
  status: string
  createdAt: string
  senderId?: string
  recipientId?: string
  user: FriendUser
}

export interface FriendRequestsData {
  incoming: FriendRequestItem[]
  outgoing: FriendRequestItem[]
}

// --- Messages privés ---
export interface ConversationPeer {
  id: string
  username: string | null
  avatar: string | null
}

export interface ConversationSummary {
  id: string
  type: string
  participant: ConversationPeer | null
  lastMessage: { id: string; senderId: string; content: string; createdAt: string } | null
  updatedAt: string
  createdAt: string
  lastReadAt: string | null
}

export interface PrivateMessageItem {
  id: string
  conversationId: string
  sender: { id: string; username: string | null }
  content: string
  createdAt: string
  editedAt: string | null
  deletedAt: string | null
}

export interface ConversationDetail {
  conversationId: string
  participant: ConversationPeer | null
  items: PrivateMessageItem[]
}

// --- Achievements ---
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
}

// --- Profil public ---
export interface PublicPlayerProfile {
  id: string
  username: string
  avatar: string | null
  bio: string | null
  memberSince: string
  stats: {
    score: number
    kdRatio: number
    winrate: number
    matchesPlayed: number
    wins: number
    losses: number
    kills: number
    deaths: number
  } | null
  leaderboardRank: number | null
  primaryGame: { id: string; name: string; slug: string } | null
  activeSeason: { id: string; name: string; status: string } | null
  teams: { id: string; name: string; tag: string; role: string }[]
  badges: {
    id: string
    code: string
    name: string
    description: string
    points: number
    unlockedAt?: string | null
  }[]
}
