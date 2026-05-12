import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PlayerStats } from './entities/player-stats.entity'
import { Game } from '../games/entities/game.entity'
import { Season } from '../seasons/entities/season.entity'
import { MockStatsProvider } from '../providers/mock/mock-stats.provider'
import { calculateKdRatio, calculateWinrate, calculateScore } from './utils/score.calculator'
import { SteamStatsProvider } from '../providers/steam/steam-stats.provider'
import { GameAccountsService } from '../game-accounts/game-accounts.service'
import { SteamTrackedGame } from '../game-accounts/entities/steam-tracked-game.entity'

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(PlayerStats) private readonly statsRepo: Repository<PlayerStats>,
    @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
    @InjectRepository(Season) private readonly seasonRepo: Repository<Season>,
    private readonly mockProvider: MockStatsProvider,
    private readonly steamStatsProvider: SteamStatsProvider,
    private readonly gameAccountsService: GameAccountsService,
  ) {}

  async getMyStats(userId: string): Promise<PlayerStats[]> {
    return this.statsRepo.find({
      where: { userId },
      relations: ['game', 'season'],
      order: { score: 'DESC' },
    })
  }

  async syncStats(userId: string, gameId?: string): Promise<PlayerStats> {
    const season = await this.getActiveSeason()
    const game = await this.resolveMockGame(gameId)

    const raw = await this.mockProvider.fetchStats({
      userId,
      gameSlug: game.slug,
    })

    return this.upsertStats({
      userId,
      game,
      season,
      provider: raw.provider,
      kills: raw.kills,
      deaths: raw.deaths,
      wins: raw.wins,
      losses: raw.losses,
      matchesPlayed: raw.matchesPlayed,
      playtimeMinutes: raw.playtimeMinutes,
    })
  }

  async syncSteamStats(userId: string): Promise<PlayerStats[]> {
    const season = await this.getActiveSeason()
    const { account, trackedGames } = await this.gameAccountsService.getTrackedSteamGamesOrThrow(userId)
    const syncedItems: PlayerStats[] = []

    for (const trackedGame of trackedGames) {
      const game = await this.resolveSteamGame(trackedGame)
      const raw = await this.steamStatsProvider.fetchStats({
        userId,
        gameSlug: game.slug,
        externalId: account.externalId,
        externalGameId: trackedGame.externalGameId,
        playtimeForever: trackedGame.playtimeForever,
        playtime2Weeks: trackedGame.playtime2Weeks,
      })

      const stats = await this.upsertStats({
        userId,
        game,
        season,
        provider: raw.provider,
        kills: raw.kills,
        deaths: raw.deaths,
        wins: raw.wins,
        losses: raw.losses,
        matchesPlayed: raw.matchesPlayed,
        playtimeMinutes: raw.playtimeMinutes,
      })

      syncedItems.push(stats)
    }

    await this.gameAccountsService.markSteamSync(account.id, account.externalUsername)
    return syncedItems
  }

  private async upsertStats(input: {
    userId: string
    game: Game
    season: Season
    provider: string
    kills: number
    deaths: number
    wins: number
    losses: number
    matchesPlayed: number
    playtimeMinutes: number
  }) {
    const kdRatio = calculateKdRatio(input.kills, input.deaths)
    const winrate = calculateWinrate(input.wins, input.matchesPlayed)
    const score = calculateScore(kdRatio, winrate, input.matchesPlayed)

    let stats = await this.statsRepo.findOne({
      where: {
        userId: input.userId,
        gameId: input.game.id,
        seasonId: input.season.id,
      },
    })

    if (!stats) {
      stats = this.statsRepo.create({
        userId: input.userId,
        gameId: input.game.id,
        seasonId: input.season.id,
      })
    }

    stats.kills = input.kills
    stats.deaths = input.deaths
    stats.wins = input.wins
    stats.losses = input.losses
    stats.matchesPlayed = input.matchesPlayed
    stats.playtimeMinutes = input.playtimeMinutes
    stats.kdRatio = kdRatio
    stats.winrate = winrate
    stats.score = score
    stats.provider = input.provider
    stats.fetchedAt = new Date()

    await this.statsRepo.save(stats)

    return this.statsRepo.findOne({
      where: { id: stats.id },
      relations: ['game', 'season'],
    }) as Promise<PlayerStats>
  }

  private async getActiveSeason() {
    const season = await this.seasonRepo.findOne({ where: { status: 'ACTIVE' } })
    if (!season) throw new NotFoundException('No active season found')
    return season
  }

  private async resolveMockGame(gameId?: string) {
    let game: Game | null
    if (gameId) {
      game = await this.gameRepo.findOne({ where: { id: gameId } })
      if (!game) throw new NotFoundException('Game not found')
      return game
    }

    game = await this.gameRepo.findOne({ where: {}, order: { createdAt: 'ASC' } })
    if (!game) throw new NotFoundException('No games available')
    return game
  }

  private async resolveSteamGame(trackedGame: SteamTrackedGame) {
    const slug = `steam-${trackedGame.externalGameId}`

    let game = await this.gameRepo.findOne({
      where: { slug },
    })

    if (!game) {
      game = this.gameRepo.create({
        name: trackedGame.name,
        slug,
        platform: 'PC',
        isTeamBased: false,
        apiProvider: 'steam',
        externalId: trackedGame.externalGameId,
        imageUrl: trackedGame.imageUrl,
      })
    } else {
      game.name = trackedGame.name
      game.apiProvider = 'steam'
      game.externalId = trackedGame.externalGameId
      game.imageUrl = trackedGame.imageUrl
    }

    return this.gameRepo.save(game)
  }
}
