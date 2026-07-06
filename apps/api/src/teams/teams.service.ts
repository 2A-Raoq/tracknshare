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
import { EncryptionService } from '../security/encryption.service'
import { isUniqueViolation } from '../common/database/is-unique-violation'
import { MESSAGE_MAX_LENGTH } from '../common/constants'

const UNAVAILABLE_MESSAGE_CONTENT = 'Message indisponible'

type TeamMessagePayload = {
  id: string
  teamId: string
  senderId: string
  sender: ChatMessage['sender']
  content: string
  createdAt: Date
}

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
    @InjectRepository(TeamMember) private readonly memberRepo: Repository<TeamMember>,
    @InjectRepository(ChatMessage) private readonly messageRepo: Repository<ChatMessage>,
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(userId: string, dto: CreateTeamDto): Promise<Team> {
    const existing = await this.teamRepo.findOne({ where: { name: dto.name } })
    if (existing) throw new ConflictException('TEAM_NAME_ALREADY_EXISTS')

    const inviteCode = randomBytes(4).toString('hex').toUpperCase()
    let team: Team
    try {
      team = await this.teamRepo.save(
        this.teamRepo.create({
          name: dto.name,
          tag: dto.tag,
          description: dto.description ?? null,
          ownerId: userId,
          inviteCode,
        }),
      )
    } catch (error) {
      // Race entre le check préalable et le save : contrainte unique sur name.
      if (isUniqueViolation(error)) throw new ConflictException('TEAM_NAME_ALREADY_EXISTS')
      throw error
    }

    await this.memberRepo.save(this.memberRepo.create({ teamId: team.id, userId, role: 'CAPTAIN' }))

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
      stats: await this.computeTeamStats(teamId),
    }
  }

  /**
   * Statistiques collectives d'une équipe : nombre de membres, score moyen
   * (moyenne des scores cumulés de chaque membre) et meilleur joueur.
   */
  private async computeTeamStats(teamId: string) {
    const rows: Array<{ userId: string; username: string; totalScore: string }> =
      await this.memberRepo.manager.query(
        `SELECT tm."userId", u.username, COALESCE(SUM(ps.score), 0)::int AS "totalScore"
           FROM team_members tm
           JOIN users u ON u.id = tm."userId"
           LEFT JOIN player_stats ps ON ps."userId" = tm."userId"
          WHERE tm."teamId" = $1
          GROUP BY tm."userId", u.username
          ORDER BY "totalScore" DESC`,
        [teamId],
      )

    const memberCount = rows.length
    const scores = rows.map((r) => Number(r.totalScore))
    const averageScore =
      memberCount > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / memberCount) : 0
    const bestPlayer =
      memberCount > 0 ? { username: rows[0].username, score: Number(rows[0].totalScore) } : null

    return { memberCount, averageScore, bestPlayer }
  }

  async join(userId: string, dto: JoinTeamDto) {
    const team = await this.teamRepo.findOne({ where: { inviteCode: dto.inviteCode } })
    if (!team) throw new NotFoundException('TEAM_INVALID_INVITE_CODE')

    const existing = await this.memberRepo.findOne({ where: { teamId: team.id, userId } })
    if (existing) throw new ConflictException('TEAM_ALREADY_MEMBER')

    try {
      await this.memberRepo.save(
        this.memberRepo.create({ teamId: team.id, userId, role: 'MEMBER' }),
      )
    } catch (error) {
      // Race entre le check préalable et le save : contrainte unique (teamId, userId).
      if (isUniqueViolation(error)) throw new ConflictException('TEAM_ALREADY_MEMBER')
      throw error
    }

    return { teamId: team.id, role: 'MEMBER' }
  }

  async leave(teamId: string, userId: string) {
    const membership = await this.memberRepo.findOne({ where: { teamId, userId } })
    if (!membership) throw new NotFoundException('TEAM_NOT_MEMBER')

    const team = await this.teamRepo.findOne({ where: { id: teamId } })
    if (!team) throw new NotFoundException('TEAM_NOT_FOUND')

    // Si le capitaine/propriétaire part : promotion du plus ancien membre
    // restant, ou dissolution de l'équipe s'il était le dernier.
    if (team.ownerId === userId) {
      const remaining = (
        await this.memberRepo.find({ where: { teamId }, order: { joinedAt: 'ASC' } })
      ).filter((m) => m.userId !== userId)

      if (remaining.length === 0) {
        await this.teamRepo.delete({ id: teamId }) // cascade membres + messages
        return { teamId, disbanded: true }
      }

      const next = remaining[0]
      next.role = 'CAPTAIN'
      await this.memberRepo.save(next)
      team.ownerId = next.userId
      await this.teamRepo.save(team)
    }

    await this.memberRepo.delete({ teamId, userId })
    return { teamId, disbanded: false }
  }

  async getMessages(teamId: string, limit = 50): Promise<TeamMessagePayload[]> {
    const messages = await this.createMessageQueryBuilder()
      .where('message.teamId = :teamId', { teamId })
      .orderBy('message.createdAt', 'ASC')
      .take(limit)
      .getMany()

    return messages.map((message) => this.toChatMessagePayload(message))
  }

  async saveMessage(
    teamId: string,
    senderId: string,
    dto: SendMessageDto,
  ): Promise<TeamMessagePayload> {
    const trimmed = dto.content.trim()
    if (!trimmed) throw new BadRequestException('CHAT_MESSAGE_EMPTY')
    if (trimmed.length > MESSAGE_MAX_LENGTH) throw new BadRequestException('CHAT_MESSAGE_TOO_LONG')

    const encrypted = this.encryptionService.encrypt(trimmed)
    const msg = await this.messageRepo.save(
      this.messageRepo.create({
        teamId,
        senderId,
        content: null,
        encryptedContent: encrypted.ciphertext,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
      }),
    )

    const full = await this.createMessageQueryBuilder()
      .where('message.id = :id', { id: msg.id })
      .getOne()

    if (!full) {
      throw new NotFoundException('CHAT_MESSAGE_NOT_FOUND')
    }

    return this.toChatMessagePayload(full)
  }

  async isMember(teamId: string, userId: string): Promise<boolean> {
    const member = await this.memberRepo.findOne({ where: { teamId, userId } })
    return !!member
  }

  private toChatMessagePayload(message: ChatMessage): TeamMessagePayload {
    return {
      id: message.id,
      teamId: message.teamId,
      senderId: message.senderId,
      sender: message.sender,
      content: this.getDecryptedContent(message),
      createdAt: message.createdAt,
    }
  }

  private getDecryptedContent(message: ChatMessage): string {
    try {
      if (message.encryptedContent && message.iv && message.authTag) {
        return this.encryptionService.decrypt({
          ciphertext: message.encryptedContent,
          iv: message.iv,
          authTag: message.authTag,
        })
      }

      if (message.content) {
        return message.content
      }
    } catch {
      return UNAVAILABLE_MESSAGE_CONTENT
    }

    return UNAVAILABLE_MESSAGE_CONTENT
  }

  private createMessageQueryBuilder() {
    return this.messageRepo
      .createQueryBuilder('message')
      .addSelect(['message.content', 'message.encryptedContent', 'message.iv', 'message.authTag'])
      .leftJoinAndSelect('message.sender', 'sender')
  }
}
