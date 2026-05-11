export interface GameInfo {
  id: string
  name: string
  slug: string
}

export interface SeasonInfo {
  id: string
  name: string
  status: string
}

export interface PlayerStatsData {
  id: string
  userId: string
  gameId: string
  seasonId: string
  provider: string
  kills: number
  deaths: number
  wins: number
  losses: number
  matchesPlayed: number
  playtimeMinutes: number
  kdRatio: number
  winrate: number
  score: number
  fetchedAt: string | null
  game: GameInfo
  season: SeasonInfo
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

export interface LeaderboardData {
  entries: LeaderboardEntry[]
  total: number
  page: number
  limit: number
}
