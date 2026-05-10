import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Achievement } from './entities/achievement.entity'
import { UserAchievement } from './entities/user-achievement.entity'

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepo: Repository<Achievement>,
    @InjectRepository(UserAchievement)
    private readonly userAchievementRepo: Repository<UserAchievement>,
  ) {}

  async listAchievements() {
    const achievements = await this.achievementRepo.find({
      order: { points: 'DESC', name: 'ASC' },
    })

    return achievements.map((achievement) => this.toAchievementPayload(achievement))
  }

  async getUserAchievements(userId: string) {
    const items = await this.userAchievementRepo.find({
      where: { userId },
      relations: ['achievement'],
      order: { unlockedAt: 'DESC' },
    })

    return items
      .filter((item) => item.achievement)
      .map((item) => this.toUserAchievementPayload(item))
  }

  private toAchievementPayload(achievement: Achievement) {
    return {
      id: achievement.id,
      code: achievement.code,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      points: achievement.points,
      createdAt: achievement.createdAt,
    }
  }

  private toUserAchievementPayload(userAchievement: UserAchievement) {
    return {
      id: userAchievement.achievement.id,
      code: userAchievement.achievement.code,
      name: userAchievement.achievement.name,
      description: userAchievement.achievement.description,
      icon: userAchievement.achievement.icon,
      points: userAchievement.achievement.points,
      unlockedAt: userAchievement.unlockedAt,
    }
  }
}
