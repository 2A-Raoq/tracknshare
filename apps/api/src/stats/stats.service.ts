import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PlayerStats } from './entities/player-stats.entity'
import { Game } from '../games/entities/game.entity'
import { Season } from '../seasons/entities/season.entity'
import { MockStatsProvider } from '../providers/mock/mock-stats.provider'
import { calculateKdRatio, calculateWinrate, calculateScore } from './utils/score.calculator'

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(PlayerStats) private readonly statsRepo: Repository<PlayerStats>,
    @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
    @InjectRepository(Season) private readonly seasonRepo: Repository<Season>,
    private readonly mockProvider: MockStatsProvider,
  ) {}

  async getMyStats(userId: string): Promise<PlayerStats[]> {
    return this.statsRepo.find({
      where: { userId },
      relations: ['game', 'season'],
      order: { score: 'DESC' },
    })
  }

  async syncStats(userId: string, gameId?: string): Promise<PlayerStats> {
    const season = await this.seasonRepo.findOne({ where: { status: 'ACTIVE' } })
    if (!season) throw new NotFoundException('No active season found')

    let game: Game | null
    if (gameId) {
      game = await this.gameRepo.findOne({ where: { id: gameId } })
      if (!game) throw new NotFoundException('Game not found')
    } else {
      game = await this.gameRepo.findOne({ where: {}, order: { createdAt: 'ASC' } })
      if (!game) throw new NotFoundException('No games available')
    }

    const raw = await this.mockProvider.fetchStats(userId, game.slug)
    const kdRatio = calculateKdRatio(raw.kills, raw.deaths)
    const winrate = calculateWinrate(raw.wins, raw.matchesPlayed)
    const score = calculateScore(kdRatio, winrate, raw.matchesPlayed)

    let stats = await this.statsRepo.findOne({
      where: { userId, gameId: game.id, seasonId: season.id },
    })

    if (!stats) {
      stats = this.statsRepo.create({ userId, gameId: game.id, seasonId: season.id })
    }

    stats.kills = raw.kills
    stats.deaths = raw.deaths
    stats.wins = raw.wins
    stats.losses = raw.losses
    stats.matchesPlayed = raw.matchesPlayed
    stats.playtimeMinutes = raw.playtimeMinutes
    stats.kdRatio = kdRatio
    stats.winrate = winrate
    stats.score = score
    stats.fetchedAt = new Date()

    await this.statsRepo.save(stats)

    return this.statsRepo.findOne({
      where: { id: stats.id },
      relations: ['game', 'season'],
    }) as Promise<PlayerStats>
  }
}
