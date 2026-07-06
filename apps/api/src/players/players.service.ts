import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, MoreThan, Repository } from 'typeorm'
import { User } from '../users/entities/user.entity'
import { PlayerStats } from '../stats/entities/player-stats.entity'
import { TeamMember } from '../teams/entities/team-member.entity'
import { UserAchievement } from '../achievements/entities/user-achievement.entity'

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(PlayerStats)
    private readonly statsRepo: Repository<PlayerStats>,
    @InjectRepository(TeamMember)
    private readonly memberRepo: Repository<TeamMember>,
    @InjectRepository(UserAchievement)
    private readonly userAchievementRepo: Repository<UserAchievement>,
  ) {}

  async getPublicProfileByUsername(username: string) {
    const user = await this.userRepo.findOne({
      where: { username: ILike(username.trim()) },
    })

    if (!user) {
      throw new NotFoundException('PLAYER_NOT_FOUND')
    }

    const statsRows = await this.statsRepo.find({
      where: { userId: user.id },
      relations: ['game', 'season'],
      order: { score: 'DESC', updatedAt: 'DESC' },
    })

    const primaryStats =
      statsRows.find((row) => row.season?.status === 'ACTIVE') ?? statsRows[0] ?? null

    const leaderboardRank = primaryStats ? await this.getLeaderboardRank(primaryStats) : null

    const memberships = await this.memberRepo.find({
      where: { userId: user.id },
      relations: ['team'],
      order: { joinedAt: 'ASC' },
    })

    const achievements = await this.userAchievementRepo.find({
      where: { userId: user.id },
      relations: ['achievement'],
      order: { unlockedAt: 'DESC' },
    })

    return {
      id: user.id,
      username: user.username,
      avatar: null,
      bio: null,
      memberSince: user.createdAt,
      stats: primaryStats
        ? {
            score: primaryStats.score,
            kdRatio: primaryStats.kdRatio,
            winrate: primaryStats.winrate,
            matchesPlayed: primaryStats.matchesPlayed,
            wins: primaryStats.wins,
            losses: primaryStats.losses,
            kills: primaryStats.kills,
            deaths: primaryStats.deaths,
          }
        : null,
      leaderboardRank,
      primaryGame: primaryStats?.game
        ? {
            id: primaryStats.game.id,
            name: primaryStats.game.name,
            slug: primaryStats.game.slug,
          }
        : null,
      activeSeason: primaryStats?.season
        ? {
            id: primaryStats.season.id,
            name: primaryStats.season.name,
            status: primaryStats.season.status,
          }
        : null,
      teams: memberships.map((membership) => ({
        id: membership.team.id,
        name: membership.team.name,
        tag: membership.team.tag,
        role: membership.role,
      })),
      badges: achievements
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
        })),
    }
  }

  private async getLeaderboardRank(stats: PlayerStats): Promise<number> {
    const higherScores = await this.statsRepo.count({
      where: {
        gameId: stats.gameId,
        seasonId: stats.seasonId,
        score: MoreThan(stats.score),
      },
    })

    return higherScores + 1
  }
}
