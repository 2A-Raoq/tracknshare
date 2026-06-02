import { Controller, Get, Query, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { HttpCacheInterceptor } from '../common/interceptors/http-cache.interceptor'
import { LeaderboardsService } from './leaderboards.service'
import { LeaderboardQueryDto } from './dto/leaderboard-query.dto'

@ApiTags('leaderboards')
@Controller('leaderboards')
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  @ApiOperation({ summary: 'Solo leaderboard (public)' })
  @UseInterceptors(HttpCacheInterceptor)
  @Get('solo')
  async getSoloLeaderboard(@Query() query: LeaderboardQueryDto) {
    const data = await this.leaderboardsService.getSoloLeaderboard(
      query.gameId,
      query.seasonId,
      query.page,
      query.limit,
      query.cursor,
    )
    return { success: true, data }
  }
}
