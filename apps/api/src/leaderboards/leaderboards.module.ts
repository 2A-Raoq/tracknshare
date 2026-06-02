import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlayerStats } from '../stats/entities/player-stats.entity'
import { Game } from '../games/entities/game.entity'
import { Season } from '../seasons/entities/season.entity'
import { RedisModule } from '../redis/redis.module'
import { LeaderboardsService } from './leaderboards.service'
import { LeaderboardsController } from './leaderboards.controller'

@Module({
  imports: [TypeOrmModule.forFeature([PlayerStats, Game, Season]), RedisModule],
  providers: [LeaderboardsService],
  controllers: [LeaderboardsController],
})
export class LeaderboardsModule {}
