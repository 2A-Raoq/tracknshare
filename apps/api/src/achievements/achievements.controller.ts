import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AchievementsService } from './achievements.service'

@ApiTags('achievements')
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  @ApiOperation({ summary: 'List available demo badges' })
  async getAllAchievements() {
    const data = await this.achievementsService.listAchievements()
    return { success: true, data }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List badges unlocked by the current user' })
  @ApiUnauthorizedResponse({ description: 'JWT missing or invalid' })
  async getMyAchievements(@Req() req: any) {
    const data = await this.achievementsService.getUserAchievements(req.user.userId)
    return { success: true, data }
  }
}
