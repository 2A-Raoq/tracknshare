import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { validateEnv } from './config/env.validation'
import { RedisModule } from './redis/redis.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { StatsModule } from './stats/stats.module'
import { LeaderboardsModule } from './leaderboards/leaderboards.module'
import { TeamsModule } from './teams/teams.module'
import { User } from './users/entities/user.entity'
import { Game } from './games/entities/game.entity'
import { Season } from './seasons/entities/season.entity'
import { PlayerStats } from './stats/entities/player-stats.entity'
import { Team } from './teams/entities/team.entity'
import { TeamMember } from './teams/entities/team-member.entity'
import { ChatMessage } from './teams/entities/chat-message.entity'
import { Conversation } from './messages/entities/conversation.entity'
import { ConversationParticipant } from './messages/entities/conversation-participant.entity'
import { PrivateMessage } from './messages/entities/private-message.entity'
import { MessagesModule } from './messages/messages.module'
import { PlayersModule } from './players/players.module'
import { FriendRequest } from './friends/entities/friend-request.entity'
import { FriendsModule } from './friends/friends.module'
import { Achievement } from './achievements/entities/achievement.entity'
import { UserAchievement } from './achievements/entities/user-achievement.entity'
import { AchievementsModule } from './achievements/achievements.module'
import { GameAccount } from './game-accounts/entities/game-account.entity'
import { GameAccountsModule } from './game-accounts/game-accounts.module'
import { SteamTrackedGame } from './game-accounts/entities/steam-tracked-game.entity'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    // Limitation de débit globale : 100 requêtes / minute / IP (anti-abus).
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
        username: config.get<string>('DB_USER', 'tracknshare'),
        password: config.get<string>('DB_PASSWORD', 'tracknshare'),
        database: config.get<string>('DB_NAME', 'tracknshare'),
        entities: [
          User,
          Game,
          Season,
          PlayerStats,
          Team,
          TeamMember,
          ChatMessage,
          Conversation,
          ConversationParticipant,
          PrivateMessage,
          FriendRequest,
          Achievement,
          UserAchievement,
          GameAccount,
          SteamTrackedGame,
        ],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    AuthModule,
    UsersModule,
    StatsModule,
    LeaderboardsModule,
    TeamsModule,
    MessagesModule,
    PlayersModule,
    FriendsModule,
    AchievementsModule,
    GameAccountsModule,
    HealthModule,
  ],
  providers: [
    // Applique la limitation de débit à toutes les routes.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
