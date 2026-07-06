import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import type { AuthenticatedRequest } from '../common/types/authenticated-request'
import { StatsService } from './stats.service'
import { SyncStatsDto } from './dto/sync-stats.dto'

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my stats' })
  @Get('me')
  async getMyStats(@Req() req: AuthenticatedRequest) {
    const stats = await this.statsService.getMyStats(req.user.userId)
    return { success: true, data: stats }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync my stats (mock provider)' })
  @ApiBody({ type: SyncStatsDto })
  @Post('sync')
  async syncStats(@Req() req: AuthenticatedRequest, @Body() dto: SyncStatsDto) {
    const stats = await this.statsService.syncStats(req.user.userId, dto.gameId)
    return { success: true, data: stats }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync my stats from Steam' })
  @Post('sync/steam')
  async syncSteamStats(@Req() req: AuthenticatedRequest) {
    const stats = await this.statsService.syncSteamStats(req.user.userId)
    return { success: true, data: stats }
  }
}
