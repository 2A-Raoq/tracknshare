import { Controller, Get, Param } from '@nestjs/common'
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { PlayersService } from './players.service'

@ApiTags('players')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get(':username')
  @ApiOperation({ summary: 'Get a public player profile by username' })
  @ApiParam({ name: 'username', type: String, example: 'DemoPlayer' })
  @ApiOkResponse({
    description: 'Public player profile',
    schema: {
      example: {
        success: true,
        data: {
          id: 'uuid',
          username: 'DemoPlayer',
          avatar: null,
          bio: null,
          memberSince: '2026-05-10T12:00:00.000Z',
          stats: {
            score: 4890,
            kdRatio: 2.48,
            winrate: 68.75,
            matchesPlayed: 80,
            wins: 55,
            losses: 25,
            kills: 2600,
            deaths: 1050,
          },
          leaderboardRank: 4,
          primaryGame: {
            id: 'uuid',
            name: 'Valorant Mock',
            slug: 'valorant-mock',
          },
          activeSeason: {
            id: 'uuid',
            name: 'Saison 1 — 2026',
            status: 'ACTIVE',
          },
          teams: [
            {
              id: 'uuid',
              name: 'Track Masters',
              tag: 'TMS',
              role: 'CAPTAIN',
            },
          ],
          badges: [],
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Player not found' })
  async getByUsername(@Param('username') username: string) {
    const data = await this.playersService.getPublicProfileByUsername(username)
    return { success: true, data }
  }
}
