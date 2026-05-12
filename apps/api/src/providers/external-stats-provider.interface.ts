export type StatsProviderName = 'MOCK' | 'STEAM'

export interface StatsProviderRequest {
  userId: string
  gameSlug: string
  externalId?: string
  externalGameId?: string
  playtimeForever?: number
  playtime2Weeks?: number | null
}

export interface RawStats {
  provider: StatsProviderName
  externalUsername?: string | null
  kills: number
  deaths: number
  wins: number
  losses: number
  matchesPlayed: number
  playtimeMinutes: number
}

export interface IStatsProvider {
  readonly provider: StatsProviderName
  fetchStats(request: StatsProviderRequest): Promise<RawStats>
}
