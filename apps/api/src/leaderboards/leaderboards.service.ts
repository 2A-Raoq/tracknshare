import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, type FindOptionsWhere } from 'typeorm'
import { PlayerStats } from '../stats/entities/player-stats.entity'
import { Game } from '../games/entities/game.entity'
import { Season } from '../seasons/entities/season.entity'

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

@Injectable()
export class LeaderboardsService {
  constructor(
    @InjectRepository(PlayerStats) private readonly statsRepo: Repository<PlayerStats>,
    @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
    @InjectRepository(Season) private readonly seasonRepo: Repository<Season>,
  ) {}

  async getSoloLeaderboard(
    gameId?: string,
    seasonId?: string,
    page = 1,
    limit = 20,
  ): Promise<{ entries: LeaderboardEntry[]; total: number; page: number; limit: number }> {
    const resolvedSeasonId = seasonId ?? (await this.getActiveSeasonId())
    const resolvedGameId = gameId ?? (await this.getFirstGameId())

    const where: FindOptionsWhere<PlayerStats> = {}
    if (resolvedSeasonId) where.seasonId = resolvedSeasonId
    if (resolvedGameId) where.gameId = resolvedGameId

    const [rows, total] = await this.statsRepo.findAndCount({
      where,
      relations: ['user', 'game'],
      order: { score: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })

    const entries: LeaderboardEntry[] = rows.map((s, idx) => ({
      rank: (page - 1) * limit + idx + 1,
      userId: s.userId,
      username: s.user?.username ?? 'Unknown',
      score: s.score,
      kdRatio: s.kdRatio,
      winrate: s.winrate,
      matchesPlayed: s.matchesPlayed,
      gameName: s.game?.name ?? 'Unknown',
    }))

    return { entries, total, page, limit }
  }

  private async getActiveSeasonId(): Promise<string | undefined> {
    const season = await this.seasonRepo.findOne({ where: { status: 'ACTIVE' } })
    return season?.id
  }

  private async getFirstGameId(): Promise<string | undefined> {
    const game = await this.gameRepo.findOne({ where: {} })
    return game?.id
  }
}
