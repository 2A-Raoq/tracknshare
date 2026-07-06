import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import type { AuthenticatedRequest } from '../common/types/authenticated-request'
import { TeamMemberGuard } from './guards/team-member.guard'
import { TeamsService } from './teams.service'
import { CreateTeamDto } from './dto/create-team.dto'
import { JoinTeamDto } from './dto/join-team.dto'
import { SendMessageDto } from './dto/send-message.dto'

@ApiTags('teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une équipe' })
  async create(@Body() dto: CreateTeamDto, @Request() req: AuthenticatedRequest) {
    const team = await this.teamsService.create(req.user.userId, dto)
    return {
      success: true,
      data: {
        id: team.id,
        name: team.name,
        tag: team.tag,
        inviteCode: team.inviteCode,
        role: 'CAPTAIN',
      },
    }
  }

  @Get('me')
  @ApiOperation({ summary: 'Mes équipes' })
  async getMyTeams(@Request() req: AuthenticatedRequest) {
    const teams = await this.teamsService.getMyTeams(req.user.userId)
    return { success: true, data: teams }
  }

  @Post('join')
  @ApiOperation({ summary: "Rejoindre une équipe via code d'invitation" })
  async join(@Body() dto: JoinTeamDto, @Request() req: AuthenticatedRequest) {
    const result = await this.teamsService.join(req.user.userId, dto)
    return { success: true, data: result }
  }

  @Get(':teamId')
  @UseGuards(TeamMemberGuard)
  @ApiOperation({ summary: "Détail d'une équipe (membre requis)" })
  async getTeam(@Param('teamId') teamId: string) {
    const team = await this.teamsService.getTeam(teamId)
    return { success: true, data: team }
  }

  @Delete(':teamId/leave')
  @UseGuards(TeamMemberGuard)
  @ApiOperation({ summary: 'Quitter une équipe (membre requis)' })
  async leave(@Param('teamId') teamId: string, @Request() req: AuthenticatedRequest) {
    const result = await this.teamsService.leave(teamId, req.user.userId)
    return { success: true, data: result }
  }

  @Get(':teamId/messages')
  @UseGuards(TeamMemberGuard)
  @ApiOperation({ summary: 'Historique du chat (membres requis)' })
  async getMessages(
    @Param('teamId') teamId: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    const messages = await this.teamsService.getMessages(teamId, limit)
    return {
      success: true,
      data: messages.map((m) => ({
        id: m.id,
        teamId: m.teamId,
        sender: { id: m.senderId, username: m.sender?.username ?? null },
        content: m.content,
        createdAt: m.createdAt,
      })),
    }
  }

  @Post(':teamId/messages')
  @UseGuards(TeamMemberGuard)
  @ApiOperation({ summary: 'Envoyer un message (REST fallback)' })
  async sendMessage(
    @Param('teamId') teamId: string,
    @Body() dto: SendMessageDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const msg = await this.teamsService.saveMessage(teamId, req.user.userId, dto)
    return {
      success: true,
      data: {
        id: msg.id,
        teamId: msg.teamId,
        sender: { id: msg.senderId, username: msg.sender?.username ?? null },
        content: msg.content,
        createdAt: msg.createdAt,
      },
    }
  }
}
