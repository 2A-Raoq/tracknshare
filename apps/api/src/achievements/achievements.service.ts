import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Achievement } from './entities/achievement.entity'
import { UserAchievement } from './entities/user-achievement.entity'
import { PlayerStats } from '../stats/entities/player-stats.entity'
import { TeamMember } from '../teams/entities/team-member.entity'
import { FriendRequest, FriendRequestStatus } from '../friends/entities/friend-request.entity'
import { ChatMessage } from '../teams/entities/chat-message.entity'
import { PrivateMessage } from '../messages/entities/private-message.entity'

interface ProgressContext {
  hasStats: boolean
  isTop5: boolean
  isTeamMember: boolean
  messageCount: number
  friendCount: number
  targetValue: number
}

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepo: Repository<Achievement>,
    @InjectRepository(UserAchievement)
    private readonly userAchievementRepo: Repository<UserAchievement>,
    @InjectRepository(PlayerStats)
    private readonly playerStatsRepo: Repository<PlayerStats>,
    @InjectRepository(TeamMember)
    private readonly teamMemberRepo: Repository<TeamMember>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepo: Repository<FriendRequest>,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepo: Repository<ChatMessage>,
    @InjectRepository(PrivateMessage)
    private readonly privateMsgRepo: Repository<PrivateMessage>,
  ) {}

  async listAchievements() {
    const achievements = await this.achievementRepo.find({
      order: { points: 'DESC', name: 'ASC' },
    })
    return achievements.map((a) => this.toAchievementPayload(a))
  }

  async getUserAchievements(userId: string) {
    const [achievements, userAchievements] = await Promise.all([
      this.achievementRepo.find({ order: { points: 'DESC', name: 'ASC' } }),
      this.userAchievementRepo.find({ where: { userId }, relations: ['achievement'] }),
    ])

    const unlockedMap = new Map(
      userAchievements
        .filter((ua) => ua.achievement)
        .map((ua) => [ua.achievement.code, ua]),
    )

    const [hasStats, isTop5, isTeamMember, messageCount, friendCount] = await Promise.all([
      this.checkHasStats(userId),
      this.checkIsTop5(userId),
      this.checkIsTeamMember(userId),
      this.countMessages(userId),
      this.countFriends(userId),
    ])

    return achievements.map((achievement) => {
      const targetValue = achievement.targetValue ?? 1
      const currentValue = this.computeCurrentValue(achievement.code, {
        hasStats,
        isTop5,
        isTeamMember,
        messageCount,
        friendCount,
        targetValue,
      })
      const progressPercent =
        targetValue > 0 ? Math.min(100, Math.round((currentValue / targetValue) * 100)) : 100
      const ua = unlockedMap.get(achievement.code)
      const unlocked = currentValue >= targetValue || !!ua

      return {
        id: achievement.id,
        code: achievement.code,
        name: achievement.name,
        description: achievement.description,
        iconKey: achievement.iconKey ?? 'default',
        points: achievement.points,
        category: achievement.category ?? 'GENERAL',
        targetValue,
        currentValue,
        progressPercent,
        unlocked,
        unlockedAt: ua?.unlockedAt ?? null,
      }
    })
  }

  // Used by PlayersService — only seeded unlocked records for public profiles
  async getPublicBadges(userId: string) {
    const items = await this.userAchievementRepo.find({
      where: { userId },
      relations: ['achievement'],
      order: { unlockedAt: 'DESC' },
    })

    return items
      .filter((item) => item.achievement)
      .map((item) => ({
        id: item.achievement.id,
        code: item.achievement.code,
        name: item.achievement.name,
        description: item.achievement.description,
        iconKey: item.achievement.iconKey ?? 'default',
        points: item.achievement.points,
        category: item.achievement.category ?? 'GENERAL',
        unlockedAt: item.unlockedAt,
      }))
  }

  private computeCurrentValue(code: string, ctx: ProgressContext): number {
    switch (code) {
      case 'FIRST_LOGIN':
        return 1
      case 'FIRST_STATS_SYNC':
        return ctx.hasStats ? 1 : 0
      case 'TOP_5_LEADERBOARD':
        return ctx.isTop5 ? 1 : 0
      case 'TEAM_FOUNDER':
        return ctx.isTeamMember ? 1 : 0
      case 'SOCIAL_PLAYER':
        return Math.min(ctx.messageCount, ctx.targetValue)
      case 'FRIENDLY':
        return Math.min(ctx.friendCount, ctx.targetValue)
      case 'CHATTER':
        return Math.min(ctx.messageCount, ctx.targetValue)
      default:
        return 0
    }
  }

  private async checkHasStats(userId: string): Promise<boolean> {
    const count = await this.playerStatsRepo.count({ where: { userId } })
    return count > 0
  }

  private async checkIsTop5(userId: string): Promise<boolean> {
    const top5 = await this.playerStatsRepo
      .createQueryBuilder('ps')
      .select('ps.userId', 'userId')
      .addSelect('SUM(ps.score)', 'totalScore')
      .groupBy('ps.userId')
      .orderBy('SUM(ps.score)', 'DESC')
      .limit(5)
      .getRawMany<{ userId: string }>()
    return top5.some((row) => row.userId === userId)
  }

  private async checkIsTeamMember(userId: string): Promise<boolean> {
    const count = await this.teamMemberRepo.count({ where: { userId } })
    return count > 0
  }

  private async countMessages(userId: string): Promise<number> {
    const [chatCount, pmCount] = await Promise.all([
      this.chatMessageRepo.count({ where: { senderId: userId } }),
      this.privateMsgRepo.count({ where: { senderId: userId } }),
    ])
    return chatCount + pmCount
  }

  private async countFriends(userId: string): Promise<number> {
    const [sentCount, receivedCount] = await Promise.all([
      this.friendRequestRepo.count({
        where: { senderId: userId, status: FriendRequestStatus.ACCEPTED },
      }),
      this.friendRequestRepo.count({
        where: { recipientId: userId, status: FriendRequestStatus.ACCEPTED },
      }),
    ])
    return sentCount + receivedCount
  }

  private toAchievementPayload(achievement: Achievement) {
    return {
      id: achievement.id,
      code: achievement.code,
      name: achievement.name,
      description: achievement.description,
      iconKey: achievement.iconKey ?? 'default',
      points: achievement.points,
      targetValue: achievement.targetValue ?? 1,
      category: achievement.category ?? 'GENERAL',
      createdAt: achievement.createdAt,
    }
  }
}
