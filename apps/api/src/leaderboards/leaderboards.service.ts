import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PlayerStats } from '../stats/entities/player-stats.entity'
import { Game } from '../games/entities/game.entity'
import { Season } from '../seasons/entities/season.entity'
import { RedisService } from '../redis/redis.service'

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

export interface LeaderboardResult {
  entries: LeaderboardEntry[]
  total: number
  limit: number
  page?: number
  nextCursor: string | null
}

const LEADERBOARD_CACHE_TTL = 30 // seconds

@Injectable()
export class LeaderboardsService {
  constructor(
    @InjectRepository(PlayerStats) private readonly statsRepo: Repository<PlayerStats>,
    @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
    @InjectRepository(Season) private readonly seasonRepo: Repository<Season>,
    private readonly redis: RedisService,
  ) {}

  async getSoloLeaderboard(
    gameId?: string,
    seasonId?: string,
    page = 1,
    limit = 20,
    cursor?: string,
  ): Promise<LeaderboardResult> {
    const resolvedSeasonId = seasonId ?? (await this.getActiveSeasonId())
    const resolvedGameId = gameId ?? (await this.getFirstGameId())

    // Cache key differentiates offset vs cursor mode
    const cacheKey = cursor
      ? `lb:${resolvedGameId}:${resolvedSeasonId}:c:${cursor}:${limit}`
      : `lb:${resolvedGameId}:${resolvedSeasonId}:p:${page}:${limit}`

    const cached = await this.redis.get<LeaderboardResult>(cacheKey)
    if (cached) return cached

    // Base QueryBuilder factory — SELECT sélectif + JOINs en une seule requête
    const buildBase = () =>
      this.statsRepo
        .createQueryBuilder('stats')
        .where(resolvedGameId ? 'stats.gameId = :gameId' : '1=1', { gameId: resolvedGameId })
        .andWhere(resolvedSeasonId ? 'stats.seasonId = :seasonId' : '1=1', {
          seasonId: resolvedSeasonId,
        })

    // Data query: only the columns we actually display (no SELECT *)
    const dataQb = buildBase()
      .select([
        'stats.id',
        'stats.userId',
        'stats.score',
        'stats.kdRatio',
        'stats.winrate',
        'stats.matchesPlayed',
      ])
      .leftJoin('stats.user', 'user')
      .addSelect(['user.id', 'user.username'])
      .leftJoin('stats.game', 'game')
      .addSelect(['game.id', 'game.name'])
      .orderBy('stats.score', 'DESC')
      .addOrderBy('stats.id', 'DESC')
      .take(limit + 1) // fetch one extra to detect hasMore without a COUNT

    let rankOffset = 0

    if (cursor) {
      // Cursor-based pagination: decode the opaque cursor
      // Cursor encodes { score, id, rank } — rank is the absolute position of the last item of the previous page
      let cursorScore = 0
      let cursorId = ''
      try {
        const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8')) as {
          score: number
          id: string
          rank: number
        }
        cursorScore = decoded.score
        cursorId = decoded.id
        rankOffset = decoded.rank // absolute position of last item on previous page
      } catch {
        // malformed cursor → fall back to first page, rankOffset stays 0
      }

      if (cursorId) {
        dataQb.andWhere('(stats.score < :cs OR (stats.score = :cs AND stats.id < :ci))', {
          cs: cursorScore,
          ci: cursorId,
        })
      }
    } else {
      // Offset-based pagination (backward compatible with existing frontend)
      dataQb.skip((page - 1) * limit)
      rankOffset = (page - 1) * limit
    }

    // Run data query and total count in parallel
    const [rows, total] = await Promise.all([dataQb.getMany(), buildBase().getCount()])

    const hasMore = rows.length > limit
    const pageRows = hasMore ? rows.slice(0, limit) : rows

    const entries: LeaderboardEntry[] = pageRows.map((s, idx) => ({
      rank: rankOffset + idx + 1,
      userId: s.userId,
      username: s.user?.username ?? 'Unknown',
      score: s.score,
      kdRatio: s.kdRatio,
      winrate: s.winrate,
      matchesPlayed: s.matchesPlayed,
      gameName: s.game?.name ?? 'Unknown',
    }))

    const lastRow = pageRows[pageRows.length - 1]
    const nextCursor =
      hasMore && lastRow
        ? Buffer.from(
            JSON.stringify({
              score: lastRow.score,
              id: lastRow.id,
              rank: rankOffset + pageRows.length,
            }),
          ).toString('base64')
        : null

    const result: LeaderboardResult = {
      entries,
      total,
      limit,
      nextCursor,
      ...(cursor ? {} : { page }),
    }

    await this.redis.set(cacheKey, result, LEADERBOARD_CACHE_TTL)
    return result
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
