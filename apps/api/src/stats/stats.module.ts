import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlayerStats } from './entities/player-stats.entity'
import { Game } from '../games/entities/game.entity'
import { Season } from '../seasons/entities/season.entity'
import { StatsService } from './stats.service'
import { StatsController } from './stats.controller'
import { MockStatsProvider } from '../providers/mock/mock-stats.provider'

@Module({
  imports: [TypeOrmModule.forFeature([PlayerStats, Game, Season])],
  providers: [StatsService, MockStatsProvider],
  controllers: [StatsController],
  exports: [StatsService],
})
export class StatsModule {}
