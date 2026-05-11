import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { GameAccountsService } from './game-accounts.service'
import { LinkSteamAccountDto } from './dto/link-steam-account.dto'

@ApiTags('game-accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('game-accounts')
export class GameAccountsController {
  constructor(private readonly gameAccountsService: GameAccountsService) {}

  @Get('me')
  @ApiOperation({ summary: 'List my linked game accounts' })
  @ApiUnauthorizedResponse({ description: 'JWT missing or invalid' })
  async getMyAccounts(@Req() req: any) {
    const accounts = await this.gameAccountsService.getMyAccounts(req.user.userId)
    return { success: true, data: accounts }
  }

  @Post('steam/link')
  @ApiOperation({ summary: 'Link a Steam account by SteamID64' })
  @ApiBody({ type: LinkSteamAccountDto })
  @ApiUnauthorizedResponse({ description: 'JWT missing or invalid' })
  async linkSteam(@Req() req: any, @Body() dto: LinkSteamAccountDto) {
    const account = await this.gameAccountsService.linkSteamAccount(req.user.userId, dto.steamId)
    return { success: true, data: account }
  }
}
