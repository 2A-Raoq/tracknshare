import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common'
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
import { UpdateTrackedSteamGamesDto } from './dto/update-tracked-steam-games.dto'

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

  @Get('steam/games')
  @ApiOperation({ summary: 'List my playable Steam games with tracked status' })
  @ApiUnauthorizedResponse({ description: 'JWT missing or invalid' })
  async getSteamGames(@Req() req: any) {
    const games = await this.gameAccountsService.getSteamGames(req.user.userId)
    return { success: true, data: games }
  }

  @Patch('steam/tracked-games')
  @ApiOperation({ summary: 'Update the list of tracked Steam games' })
  @ApiBody({ type: UpdateTrackedSteamGamesDto })
  @ApiUnauthorizedResponse({ description: 'JWT missing or invalid' })
  async updateTrackedSteamGames(@Req() req: any, @Body() dto: UpdateTrackedSteamGamesDto) {
    const games = await this.gameAccountsService.updateTrackedSteamGames(
      req.user.userId,
      dto.appIds,
    )
    return { success: true, data: games }
  }
}
