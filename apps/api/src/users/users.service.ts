import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, ILike, Repository } from 'typeorm'
import { User } from './entities/user.entity'
import * as bcrypt from 'bcrypt'

export type PublicUser = Omit<User, 'passwordHash'>

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } })
  }

  async findByEmailWithPasswordHash(email: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne()
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } })
  }

  async create(data: { email: string; username: string; password: string }): Promise<User> {
    const existing = await this.findByEmail(data.email)
    if (existing) throw new ConflictException('USER_EMAIL_ALREADY_EXISTS')

    const passwordHash = await bcrypt.hash(data.password, 10)
    const user = this.userRepo.create({ email: data.email, username: data.username, passwordHash })
    return this.userRepo.save(user)
  }

  async getPublicById(id: string): Promise<PublicUser> {
    const user = await this.findById(id)
    if (!user) throw new NotFoundException()
    return this.toPublic(user)
  }

  async updateProfile(id: string, data: { username: string }): Promise<PublicUser> {
    const user = await this.findById(id)
    if (!user) throw new NotFoundException()

    const username = data.username.trim()
    if (username !== user.username) {
      const existing = await this.userRepo.findOne({ where: { username } })
      if (existing) throw new ConflictException('USER_USERNAME_ALREADY_EXISTS')
      user.username = username
      await this.userRepo.save(user)
    }

    return this.toPublic(user)
  }

  async searchByUsername(query: string, excludeUserId?: string) {
    const trimmed = query.trim()
    if (!trimmed) {
      return []
    }

    const users = await this.userRepo.find({
      where: { username: ILike(`%${trimmed}%`) },
      order: { username: 'ASC' },
      take: 10,
    })

    return users
      .filter((user) => user.id !== excludeUserId)
      .map((user) => ({
        id: user.id,
        username: user.username,
        avatar: null,
      }))
  }

  toPublic(user: User): PublicUser {
    const { passwordHash: _omit, ...publicUser } = user
    return publicUser
  }

  /**
   * RGPD — droit à la portabilité : exporte l'ensemble des données
   * personnelles de l'utilisateur sous forme d'un objet JSON.
   */
  async exportUserData(id: string) {
    const user = await this.getPublicById(id)

    type Rows = Record<string, unknown>[]
    const [stats, teamsOwned, teamMemberships, gameAccounts, achievements] = await Promise.all([
      this.dataSource.query<Rows>('SELECT * FROM player_stats WHERE "userId" = $1', [id]),
      this.dataSource.query<Rows>('SELECT * FROM teams WHERE "ownerId" = $1', [id]),
      this.dataSource.query<Rows>('SELECT * FROM team_members WHERE "userId" = $1', [id]),
      this.dataSource.query<Rows>('SELECT * FROM game_accounts WHERE "userId" = $1', [id]),
      this.dataSource.query<Rows>(
        `SELECT a.code, a.name, ua."unlockedAt"
             FROM user_achievements ua
             JOIN achievements a ON a.id = ua."achievementId"
            WHERE ua."userId" = $1`,
        [id],
      ),
    ])

    return {
      profile: user,
      stats,
      teamsOwned,
      teamMemberships,
      gameAccounts,
      achievements,
      exportedAt: new Date().toISOString(),
    }
  }

  /**
   * RGPD — droit à l'effacement : supprime le compte et toutes les données
   * personnelles associées, dans une transaction. Les relations marquées
   * ON DELETE CASCADE (succès, demandes d'amis, participations et messages
   * privés) sont purgées automatiquement lors de la suppression du user ;
   * les autres dépendances sont nettoyées explicitement ci-dessous.
   */
  async deleteAccount(id: string): Promise<void> {
    const user = await this.findById(id)
    if (!user) throw new NotFoundException()

    await this.dataSource.transaction(async (manager) => {
      // Équipes possédées : supprime aussi membres et messages (cascade FK team).
      await manager.query('DELETE FROM teams WHERE "ownerId" = $1', [id])
      // Messages d'équipe écrits par l'utilisateur (pas de cascade côté sender).
      await manager.query('DELETE FROM chat_messages WHERE "senderId" = $1', [id])
      // Appartenances à des équipes appartenant à d'autres.
      await manager.query('DELETE FROM team_members WHERE "userId" = $1', [id])
      // Statistiques de jeu.
      await manager.query('DELETE FROM player_stats WHERE "userId" = $1', [id])
      // Comptes de jeu liés et jeux Steam suivis (id::text : gameAccountId est varchar).
      await manager.query(
        'DELETE FROM steam_tracked_games WHERE "gameAccountId" IN (SELECT id::text FROM game_accounts WHERE "userId" = $1)',
        [id],
      )
      await manager.query('DELETE FROM game_accounts WHERE "userId" = $1', [id])
      // Le compte lui-même (cascade : succès, amis, conversations, messages privés).
      // Via le repository TypeORM pour un typage uuid correct du paramètre.
      await manager.getRepository(User).delete(id)
    })
  }
}
