import { Injectable } from '@nestjs/common'
import type {
  IStatsProvider,
  RawStats,
  StatsProviderRequest,
} from '../external-stats-provider.interface'

@Injectable()
export class MockStatsProvider implements IStatsProvider {
  readonly provider = 'MOCK' as const

  fetchStats(_request: StatsProviderRequest): Promise<RawStats> {
    const matchesPlayed = this.rand(20, 80)
    const wins = this.rand(Math.floor(matchesPlayed * 0.3), Math.floor(matchesPlayed * 0.75))
    const losses = matchesPlayed - wins
    const kills = this.rand(matchesPlayed * 8, matchesPlayed * 25)
    const deaths = this.rand(matchesPlayed * 5, matchesPlayed * 20)
    const playtimeMinutes = matchesPlayed * this.rand(25, 45)

    return Promise.resolve({
      provider: this.provider,
      kills,
      deaths,
      wins,
      losses,
      matchesPlayed,
      playtimeMinutes,
    })
  }

  private rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
