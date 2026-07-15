import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import type { AuthenticatedRequest } from '../common/types/authenticated-request'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  async me(@Req() req: AuthenticatedRequest) {
    const user = await this.usersService.getPublicById(req.user.userId)
    return { success: true, data: user }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'q', required: false, type: String })
  @Get('search')
  async search(@Req() req: AuthenticatedRequest, @Query('q') query = '') {
    const users = await this.usersService.searchByUsername(query, req.user.userId)
    return { success: true, data: users }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour mon profil (pseudo)' })
  @Patch('me')
  async updateMe(@Req() req: AuthenticatedRequest, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.updateProfile(req.user.userId, dto)
    return { success: true, data: user }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'RGPD — exporter mes données personnelles (JSON)' })
  @Get('me/export')
  async exportMyData(@Req() req: AuthenticatedRequest) {
    const data = await this.usersService.exportUserData(req.user.userId)
    return { success: true, data }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'RGPD — supprimer mon compte et toutes mes données' })
  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMyAccount(@Req() req: AuthenticatedRequest) {
    await this.usersService.deleteAccount(req.user.userId)
  }
}
