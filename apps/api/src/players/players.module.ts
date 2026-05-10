import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../users/entities/user.entity'
import { PlayerStats } from '../stats/entities/player-stats.entity'
import { TeamMember } from '../teams/entities/team-member.entity'
import { PlayersController } from './players.controller'
import { PlayersService } from './players.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, PlayerStats, TeamMember])],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
