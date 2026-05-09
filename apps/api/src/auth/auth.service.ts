import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt'

interface AuthResponse {
  user: any
  accessToken: string
  refreshToken: string
}

interface SteamAuthResponse {
  user: any
  accessToken: string
}

interface RefreshResponse {
  accessToken: string
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwt: JwtService,
  ) { }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(email)

    if (!user) throw new UnauthorizedException()

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new UnauthorizedException()

    const accessToken = this.jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      { expiresIn: '15m' },
    )

    const refreshToken = this.jwt.sign(
      {
        sub: user.id,
      },
      { expiresIn: '7d' },
    )

    return { user, accessToken, refreshToken }
  }

  async refresh(userId: string): Promise<RefreshResponse> {
    const user = await this.usersService.findById(userId)

    if (!user) throw new UnauthorizedException()

    const accessToken = this.jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      { expiresIn: '15m' },
    )

    return { accessToken }
  }

  async loginSteam(steamId: string): Promise<SteamAuthResponse> {
    let user =
      await this.usersService.findBySteamId(steamId)

    if (!user) {
      user =
        await this.usersService.create({
          steamId,
          email: `steam_${steamId}@local`,
        })
    }

    if (!user) {
      throw new UnauthorizedException()
    }

    const accessToken = this.jwt.sign({
      sub: user.id,
      steamId: user.steamId,
    })

    return { user, accessToken }
  }
}