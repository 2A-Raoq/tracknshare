import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UsersService } from './users.service'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  async me(@Req() req: any) {
    const user = await this.usersService.getPublicById(req.user.userId)
    return { success: true, data: user }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'q', required: false, type: String })
  @Get('search')
  async search(@Req() req: any, @Query('q') query = '') {
    const users = await this.usersService.searchByUsername(query, req.user.userId)
    return { success: true, data: users }
  }
}
