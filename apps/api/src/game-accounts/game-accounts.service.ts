import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GameAccount } from './entities/game-account.entity'
import { SteamStatsProvider } from '../providers/steam/steam-stats.provider'

export const STEAM_PLATFORM = 'STEAM'

@Injectable()
export class GameAccountsService {
  constructor(
    @InjectRepository(GameAccount)
    private readonly gameAccountRepo: Repository<GameAccount>,
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

    const saved = await this.gameAccountRepo.save(account)
    return this.toPublicAccount(saved)
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
