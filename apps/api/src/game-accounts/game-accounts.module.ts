import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GameAccount } from './entities/game-account.entity'
import { GameAccountsService } from './game-accounts.service'
import { GameAccountsController } from './game-accounts.controller'
import { SteamStatsProvider } from '../providers/steam/steam-stats.provider'
import { SteamTrackedGame } from './entities/steam-tracked-game.entity'

@Module({
  imports: [TypeOrmModule.forFeature([GameAccount, SteamTrackedGame])],
  providers: [GameAccountsService, SteamStatsProvider],
  controllers: [GameAccountsController],
  exports: [GameAccountsService, SteamStatsProvider],
})
export class GameAccountsModule {}
