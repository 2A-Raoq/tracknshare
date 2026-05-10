import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlayerStats } from '../stats/entities/player-stats.entity'
import { Game } from '../games/entities/game.entity'
import { Season } from '../seasons/entities/season.entity'
import { LeaderboardsService } from './leaderboards.service'
import { LeaderboardsController } from './leaderboards.controller'

@Module({
  imports: [TypeOrmModule.forFeature([PlayerStats, Game, Season])],
  providers: [LeaderboardsService],
  controllers: [LeaderboardsController],
})
export class LeaderboardsModule {}
