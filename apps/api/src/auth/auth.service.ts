import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, username: string, password: string) {
    const user = await this.usersService.create({ email, username, password })
    const accessToken = this.signToken(user.id, user.role)
    return { user: this.usersService.toPublic(user), accessToken }
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email)
    if (!user) throw new UnauthorizedException('AUTH_INVALID_CREDENTIALS')

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('AUTH_INVALID_CREDENTIALS')

    const accessToken = this.signToken(user.id, user.role)
    return { user: this.usersService.toPublic(user), accessToken }
  }

  private signToken(userId: string, role: string): string {
    return this.jwtService.sign({ sub: userId, role })
  }
}
