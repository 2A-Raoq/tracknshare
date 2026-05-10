export interface PublicPlayerStats {
  score: number
  kdRatio: number
  winrate: number
  matchesPlayed: number
  wins: number
  losses: number
  kills: number
  deaths: number
}

export interface PublicPlayerGame {
  id: string
  name: string
  slug: string
}

export interface PublicPlayerSeason {
  id: string
  name: string
  status: string
}

export interface PublicPlayerTeam {
  id: string
  name: string
  tag: string
  role: string
}

export interface PublicPlayerProfile {
  id: string
  username: string
  avatar: string | null
  bio: string | null
  memberSince: string
  stats: PublicPlayerStats | null
  leaderboardRank: number | null
  primaryGame: PublicPlayerGame | null
  activeSeason: PublicPlayerSeason | null
  teams: PublicPlayerTeam[]
  badges: string[]
}
