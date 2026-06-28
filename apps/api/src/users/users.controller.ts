import {
  Controller,
  Get,
  Delete,
  UseGuards,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'RGPD — exporter mes données personnelles (JSON)' })
  @Get('me/export')
  async exportMyData(@Req() req: any) {
    const data = await this.usersService.exportUserData(req.user.userId)
    return { success: true, data }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'RGPD — supprimer mon compte et toutes mes données' })
  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMyAccount(@Req() req: any) {
    await this.usersService.deleteAccount(req.user.userId)
  }
}
