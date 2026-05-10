import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Team } from '../entities/team.entity'
import { TeamMember } from '../entities/team-member.entity'

@Injectable()
export class TeamMemberGuard implements CanActivate {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
    @InjectRepository(TeamMember)
    private readonly memberRepo: Repository<TeamMember>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const userId: string | undefined = req.user?.userId
    const teamId: string | undefined = req.params?.teamId

    if (!userId || !teamId) throw new ForbiddenException('TEAM_MEMBER_REQUIRED')

    const team = await this.teamRepo.findOne({ where: { id: teamId } })
    if (!team) throw new NotFoundException('TEAM_NOT_FOUND')

    const member = await this.memberRepo.findOne({ where: { teamId, userId } })
    if (!member) throw new ForbiddenException('TEAM_MEMBER_REQUIRED')

    req.teamMember = member
    return true
  }
}
