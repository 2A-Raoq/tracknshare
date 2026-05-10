import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { randomBytes } from 'crypto'
import { Team } from './entities/team.entity'
import { TeamMember } from './entities/team-member.entity'
import { ChatMessage } from './entities/chat-message.entity'
import { CreateTeamDto } from './dto/create-team.dto'
import { JoinTeamDto } from './dto/join-team.dto'
import { SendMessageDto } from './dto/send-message.dto'

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
    @InjectRepository(TeamMember) private readonly memberRepo: Repository<TeamMember>,
    @InjectRepository(ChatMessage) private readonly messageRepo: Repository<ChatMessage>,
  ) {}

  async create(userId: string, dto: CreateTeamDto): Promise<Team> {
    const existing = await this.teamRepo.findOne({ where: { name: dto.name } })
    if (existing) throw new ConflictException('TEAM_NAME_ALREADY_EXISTS')

    const inviteCode = randomBytes(4).toString('hex').toUpperCase()
    const team = await this.teamRepo.save(
      this.teamRepo.create({
        name: dto.name,
        tag: dto.tag,
        description: dto.description ?? null,
        ownerId: userId,
        inviteCode,
      }),
    )

    await this.memberRepo.save(
      this.memberRepo.create({ teamId: team.id, userId, role: 'CAPTAIN' }),
    )

    return team
  }

  async getMyTeams(userId: string) {
    const memberships = await this.memberRepo.find({
      where: { userId },
      relations: ['team'],
    })
    return memberships.map((m) => ({
      id: m.team.id,
      name: m.team.name,
      tag: m.team.tag,
      role: m.role,
    }))
  }

  async getTeam(teamId: string) {
    const team = await this.teamRepo.findOne({
      where: { id: teamId },
      relations: ['members', 'members.user'],
    })
    if (!team) throw new NotFoundException('TEAM_NOT_FOUND')

    return {
      id: team.id,
      name: team.name,
      tag: team.tag,
      description: team.description,
      inviteCode: team.inviteCode,
      members: team.members.map((m) => ({
        id: m.userId,
        username: m.user?.username ?? null,
        role: m.role,
        joinedAt: m.joinedAt,
      })),
    }
  }

  async join(userId: string, dto: JoinTeamDto) {
    const team = await this.teamRepo.findOne({ where: { inviteCode: dto.inviteCode } })
    if (!team) throw new NotFoundException('TEAM_INVALID_INVITE_CODE')

    const existing = await this.memberRepo.findOne({ where: { teamId: team.id, userId } })
    if (existing) throw new ConflictException('TEAM_ALREADY_MEMBER')

    await this.memberRepo.save(
      this.memberRepo.create({ teamId: team.id, userId, role: 'MEMBER' }),
    )

    return { teamId: team.id, role: 'MEMBER' }
  }

  async getMessages(teamId: string, limit = 50) {
    return this.messageRepo.find({
      where: { teamId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
      take: limit,
    })
  }

  async saveMessage(
    teamId: string,
    senderId: string,
    dto: SendMessageDto,
  ): Promise<ChatMessage> {
    const trimmed = dto.content.trim()
    if (!trimmed) throw new BadRequestException('CHAT_MESSAGE_EMPTY')

    const msg = await this.messageRepo.save(
      this.messageRepo.create({ teamId, senderId, content: trimmed }),
    )

    const full = await this.messageRepo.findOne({
      where: { id: msg.id },
      relations: ['sender'],
    })
    return full!
  }

  async isMember(teamId: string, userId: string): Promise<boolean> {
    const member = await this.memberRepo.findOne({ where: { teamId, userId } })
    return !!member
  }
}
