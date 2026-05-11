import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Achievement } from './entities/achievement.entity'
import { UserAchievement } from './entities/user-achievement.entity'
import { AchievementsController } from './achievements.controller'
import { AchievementsService } from './achievements.service'
import { PlayerStats } from '../stats/entities/player-stats.entity'
import { TeamMember } from '../teams/entities/team-member.entity'
import { FriendRequest } from '../friends/entities/friend-request.entity'
import { ChatMessage } from '../teams/entities/chat-message.entity'
import { PrivateMessage } from '../messages/entities/private-message.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Achievement,
      UserAchievement,
      PlayerStats,
      TeamMember,
      FriendRequest,
      ChatMessage,
      PrivateMessage,
    ]),
  ],
  controllers: [AchievementsController],
  providers: [AchievementsService],
  exports: [AchievementsService],
})
export class AchievementsModule {}
