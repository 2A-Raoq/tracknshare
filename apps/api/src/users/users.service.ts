import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'
import { User } from './entities/user.entity'
import * as bcrypt from 'bcrypt'

export type PublicUser = Omit<User, 'passwordHash'>

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
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
}
