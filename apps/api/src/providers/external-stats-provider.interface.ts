export interface RawStats {
  kills: number
  deaths: number
  wins: number
  losses: number
  matchesPlayed: number
  playtimeMinutes: number
}

export interface IStatsProvider {
  fetchStats(userId: string, gameSlug: string): Promise<RawStats>
}
