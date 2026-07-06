import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GameAccount } from './entities/game-account.entity'
import { SteamStatsProvider } from '../providers/steam/steam-stats.provider'
import { SteamTrackedGame } from './entities/steam-tracked-game.entity'
import { isUniqueViolation } from '../common/database/is-unique-violation'

export const STEAM_PLATFORM = 'STEAM'

@Injectable()
export class GameAccountsService {
  constructor(
    @InjectRepository(GameAccount)
    private readonly gameAccountRepo: Repository<GameAccount>,
    @InjectRepository(SteamTrackedGame)
    private readonly steamTrackedGameRepo: Repository<SteamTrackedGame>,
    private readonly steamStatsProvider: SteamStatsProvider,
  ) {}

  async getMyAccounts(userId: string) {
    const accounts = await this.gameAccountRepo.find({
      where: { userId },
      order: { linkedAt: 'ASC' },
    })

    return accounts.map((account) => this.toPublicAccount(account))
  }

  async linkSteamAccount(userId: string, steamId: string) {
    const profile = await this.steamStatsProvider.getPlayerSummary(steamId)

    const existingByExternalId = await this.gameAccountRepo.findOne({
      where: { platform: STEAM_PLATFORM, externalId: steamId },
    })

    if (existingByExternalId && existingByExternalId.userId !== userId) {
      throw new ConflictException('STEAM_ACCOUNT_ALREADY_LINKED')
    }

    let account = await this.gameAccountRepo.findOne({
      where: { userId, platform: STEAM_PLATFORM },
    })

    if (!account) {
      account = this.gameAccountRepo.create({
        userId,
        platform: STEAM_PLATFORM,
        externalId: steamId,
        externalUsername: profile.personaName,
        linkedAt: new Date(),
        lastSyncAt: null,
      })
    } else {
      if (account.externalId !== steamId) {
        account.lastSyncAt = null
      }
      account.externalId = steamId
      account.externalUsername = profile.personaName
    }

    try {
      const saved = await this.gameAccountRepo.save(account)
      return this.toPublicAccount(saved)
    } catch (error) {
      // Race entre le check préalable et le save : contrainte unique
      // (platform, externalId) — le steamId vient d'être lié par un autre compte.
      if (isUniqueViolation(error)) {
        throw new ConflictException('STEAM_ACCOUNT_ALREADY_LINKED')
      }
      throw error
    }
  }

  async getSteamAccountOrThrow(userId: string) {
    const account = await this.gameAccountRepo.findOne({
      where: { userId, platform: STEAM_PLATFORM },
    })

    if (!account) {
      throw new NotFoundException('STEAM_ACCOUNT_NOT_LINKED')
    }

    return account
  }

  async getSteamGames(userId: string) {
    const account = await this.getSteamAccountOrThrow(userId)
    const [steamGames, trackedGames] = await Promise.all([
      this.steamStatsProvider.getPlayableGames(account.externalId),
      this.steamTrackedGameRepo.find({
        where: { userId, provider: STEAM_PLATFORM },
      }),
    ])

    const trackedByAppId = new Map(trackedGames.map((game) => [game.externalGameId, game]))

    return steamGames.map((game) => {
      const tracked = trackedByAppId.get(game.appId)
      return {
        ...game,
        isTracked: tracked?.isTracked ?? false,
      }
    })
  }

  async updateTrackedSteamGames(userId: string, appIds: string[]) {
    const account = await this.getSteamAccountOrThrow(userId)
    const steamGames = await this.steamStatsProvider.getPlayableGames(account.externalId)
    const validAppIds = new Set(steamGames.map((game) => game.appId))
    const selectedAppIds = new Set(appIds.filter((appId) => validAppIds.has(appId)))
    const existingTrackedGames = await this.steamTrackedGameRepo.find({
      where: { userId, provider: STEAM_PLATFORM },
    })
    const existingByAppId = new Map(existingTrackedGames.map((game) => [game.externalGameId, game]))
    const now = new Date()

    const upserts = steamGames.map((game) => {
      const existing = existingByAppId.get(game.appId)
      if (existing) {
        existing.gameAccountId = account.id
        existing.name = game.name
        existing.playtimeForever = game.playtimeForever
        existing.playtime2Weeks = game.playtime2Weeks
        existing.imageUrl = game.imageUrl
        existing.isTracked = selectedAppIds.has(game.appId)
        existing.lastSeenAt = now
        return existing
      }

      return this.steamTrackedGameRepo.create({
        userId,
        gameAccountId: account.id,
        provider: STEAM_PLATFORM,
        externalGameId: game.appId,
        name: game.name,
        playtimeForever: game.playtimeForever,
        playtime2Weeks: game.playtime2Weeks,
        imageUrl: game.imageUrl,
        isTracked: selectedAppIds.has(game.appId),
        lastSeenAt: now,
      })
    })

    await this.steamTrackedGameRepo.save(upserts)

    const upsertedByAppId = new Map(upserts.map((game) => [game.externalGameId, game]))
    for (const existing of existingTrackedGames) {
      if (upsertedByAppId.has(existing.externalGameId)) {
        continue
      }

      existing.isTracked = false
      await this.steamTrackedGameRepo.save(existing)
    }

    return steamGames.map((game) => ({
      ...game,
      isTracked: selectedAppIds.has(game.appId),
    }))
  }

  async getTrackedSteamGamesOrThrow(userId: string) {
    const account = await this.getSteamAccountOrThrow(userId)
    const trackedGames = await this.steamTrackedGameRepo.find({
      where: {
        userId,
        gameAccountId: account.id,
        provider: STEAM_PLATFORM,
        isTracked: true,
      },
      order: { playtimeForever: 'DESC', name: 'ASC' },
    })

    if (trackedGames.length === 0) {
      throw new NotFoundException('STEAM_NO_TRACKED_GAMES')
    }

    return { account, trackedGames }
  }

  async markSteamSync(accountId: string, externalUsername?: string | null) {
    const account = await this.gameAccountRepo.findOne({ where: { id: accountId } })
    if (!account) {
      throw new NotFoundException('GAME_ACCOUNT_NOT_FOUND')
    }

    account.lastSyncAt = new Date()
    if (typeof externalUsername === 'string' && externalUsername.trim()) {
      account.externalUsername = externalUsername
    }

    const saved = await this.gameAccountRepo.save(account)
    return this.toPublicAccount(saved)
  }

  private toPublicAccount(account: GameAccount) {
    return {
      id: account.id,
      platform: account.platform,
      externalId: account.externalId,
      externalUsername: account.externalUsername,
      linkedAt: account.linkedAt,
      lastSyncAt: account.lastSyncAt,
    }
  }
}
