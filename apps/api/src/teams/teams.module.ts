import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { Team } from './entities/team.entity'
import { TeamMember } from './entities/team-member.entity'
import { ChatMessage } from './entities/chat-message.entity'
import { TeamsService } from './teams.service'
import { TeamsController } from './teams.controller'
import { TeamMemberGuard } from './guards/team-member.guard'
import { TeamRoleGuard } from './guards/team-role.guard'
import { ChatGateway } from './chat.gateway'
import { SecurityModule } from '../security/security.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, TeamMember, ChatMessage]),
    ConfigModule,
    SecurityModule,
  ],
  controllers: [TeamsController],
  providers: [TeamsService, TeamMemberGuard, TeamRoleGuard, ChatGateway],
  exports: [TeamsService, TeamMemberGuard, TeamRoleGuard],
})
export class TeamsModule {}
