import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { LeaderboardsService } from './leaderboards.service'
import { LeaderboardQueryDto } from './dto/leaderboard-query.dto'

@ApiTags('leaderboards')
@Controller('leaderboards')
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  @ApiOperation({ summary: 'Solo leaderboard (public)' })
  @Get('solo')
  async getSoloLeaderboard(@Query() query: LeaderboardQueryDto) {
    const data = await this.leaderboardsService.getSoloLeaderboard(
      query.gameId,
      query.seasonId,
      query.page,
      query.limit,
    )
    return { success: true, data }
  }
}
