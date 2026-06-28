import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { TeamsService } from './teams.service'
import { Team } from './entities/team.entity'
import { TeamMember } from './entities/team-member.entity'
import { ChatMessage } from './entities/chat-message.entity'
import { EncryptionService } from '../security/encryption.service'

describe('TeamsService.leave', () => {
  let service: TeamsService
  let teamRepo: { findOne: jest.Mock; save: jest.Mock; delete: jest.Mock }
  let memberRepo: {
    findOne: jest.Mock
    find: jest.Mock
    save: jest.Mock
    delete: jest.Mock
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    teamRepo = { findOne: jest.fn(), save: jest.fn(), delete: jest.fn() }
    memberRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        { provide: getRepositoryToken(Team), useValue: teamRepo },
        { provide: getRepositoryToken(TeamMember), useValue: memberRepo },
        { provide: getRepositoryToken(ChatMessage), useValue: {} },
        { provide: EncryptionService, useValue: {} },
      ],
    }).compile()

    service = module.get(TeamsService)
  })

  it('rejette si l’utilisateur n’est pas membre', async () => {
    memberRepo.findOne.mockResolvedValue(null)
    await expect(service.leave('team-1', 'user-x')).rejects.toThrow(
      NotFoundException,
    )
  })

  it('retire simplement un membre non-propriétaire', async () => {
    memberRepo.findOne.mockResolvedValue({ teamId: 'team-1', userId: 'user-2' })
    teamRepo.findOne.mockResolvedValue({ id: 'team-1', ownerId: 'user-1' })

    const result = await service.leave('team-1', 'user-2')

    expect(result).toEqual({ teamId: 'team-1', disbanded: false })
    expect(memberRepo.delete).toHaveBeenCalledWith({ teamId: 'team-1', userId: 'user-2' })
    expect(teamRepo.delete).not.toHaveBeenCalled()
    expect(teamRepo.save).not.toHaveBeenCalled()
  })

  it('promeut le membre le plus ancien quand le propriétaire part', async () => {
    memberRepo.findOne.mockResolvedValue({ teamId: 'team-1', userId: 'user-1' })
    teamRepo.findOne.mockResolvedValue({ id: 'team-1', ownerId: 'user-1' })
    memberRepo.find.mockResolvedValue([
      { teamId: 'team-1', userId: 'user-1', role: 'CAPTAIN' },
      { teamId: 'team-1', userId: 'user-2', role: 'MEMBER' },
    ])

    const result = await service.leave('team-1', 'user-1')

    expect(result).toEqual({ teamId: 'team-1', disbanded: false })
    expect(memberRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-2', role: 'CAPTAIN' }),
    )
    expect(teamRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'team-1', ownerId: 'user-2' }),
    )
    expect(teamRepo.delete).not.toHaveBeenCalled()
  })

  it('dissout l’équipe si le propriétaire est le dernier membre', async () => {
    memberRepo.findOne.mockResolvedValue({ teamId: 'team-1', userId: 'user-1' })
    teamRepo.findOne.mockResolvedValue({ id: 'team-1', ownerId: 'user-1' })
    memberRepo.find.mockResolvedValue([
      { teamId: 'team-1', userId: 'user-1', role: 'CAPTAIN' },
    ])

    const result = await service.leave('team-1', 'user-1')

    expect(result).toEqual({ teamId: 'team-1', disbanded: true })
    expect(teamRepo.delete).toHaveBeenCalledWith({ id: 'team-1' })
  })
})
