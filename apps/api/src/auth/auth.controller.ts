import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import type { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt-auth.guard'


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return {
      user: req.user,
    }
  }

  @Get('steam')
  steamLogin(@Req() req: Request, @Res() res: Response) {
    const returnUrl =
      'http://localhost:3000/auth/steam/return'

    const steamOpenIdUrl =
      `https://steamcommunity.com/openid/login` +
      `?openid.mode=checkid_setup` +
      `&openid.return_to=${returnUrl}` +
      `&openid.realm=http://localhost:3000` +
      `&openid.ns=http://specs.openid.net/auth/2.0`

    return res.redirect(steamOpenIdUrl)
  }

  @Get('steam/callback')
  async steamCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const claimedId =
      req.query['openid.claimed_id'] as string

    const steamId = claimedId?.split('/').pop()

    if (!steamId) {
      return res.redirect('http://localhost:5173/login')
    }

    const user =
      await this.authService.loginSteam(steamId)

    res.cookie('access_token', user.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
    })

    return res.redirect('http://localhost:5173')
  }
}