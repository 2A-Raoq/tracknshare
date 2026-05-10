import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TeamMember, TeamRole } from '../entities/team-member.entity'

@Injectable()
export class TeamRoleGuard implements CanActivate {
  constructor(
    @InjectRepository(TeamMember)
    private readonly memberRepo: Repository<TeamMember>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const userId: string | undefined = req.user?.userId
    const teamId: string | undefined = req.params?.teamId

    if (!userId || !teamId) throw new ForbiddenException('AUTH_FORBIDDEN')

    const member = await this.memberRepo.findOne({ where: { teamId, userId } })
    if (!member || member.role !== TeamRole.CAPTAIN) {
      throw new ForbiddenException('AUTH_FORBIDDEN')
    }

    return true
  }
}
