import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TeamMemberGuard } from './team-member.guard';
import { Team } from '../entities/team.entity';
import { TeamMember } from '../entities/team-member.entity';

function mockContext(user: unknown, params: unknown): ExecutionContext {
  const req: Record<string, unknown> = { user, params };
  return {
    switchToHttp: () => ({ getRequest: () => req }),
  } as unknown as ExecutionContext;
}

describe('TeamMemberGuard', () => {
  let guard: TeamMemberGuard;
  let teamRepo: { findOne: jest.Mock };
  let memberRepo: { findOne: jest.Mock };

  beforeEach(async () => {
    teamRepo = { findOne: jest.fn() };
    memberRepo = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamMemberGuard,
        { provide: getRepositoryToken(Team), useValue: teamRepo },
        { provide: getRepositoryToken(TeamMember), useValue: memberRepo },
      ],
    }).compile();

    guard = module.get(TeamMemberGuard);
  });

  it('autorise un membre de l’équipe et attache le membre à la requête', async () => {
    const member = {
      id: 'm1',
      teamId: 'team-1',
      userId: 'user-1',
      role: 'MEMBER',
    };
    teamRepo.findOne.mockResolvedValue({ id: 'team-1' });
    memberRepo.findOne.mockResolvedValue(member);

    const req: Record<string, unknown> = {
      user: { userId: 'user-1' },
      params: { teamId: 'team-1' },
    };
    const ctx = {
      switchToHttp: () => ({ getRequest: () => req }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(req.teamMember).toEqual(member);
  });

  it('refuse un utilisateur non authentifié', async () => {
    const ctx = mockContext(undefined, { teamId: 'team-1' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('renvoie 404 si l’équipe n’existe pas', async () => {
    teamRepo.findOne.mockResolvedValue(null);
    const ctx = mockContext({ userId: 'user-1' }, { teamId: 'inconnu' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(NotFoundException);
  });

  it('refuse un utilisateur qui n’est pas membre de l’équipe', async () => {
    teamRepo.findOne.mockResolvedValue({ id: 'team-1' });
    memberRepo.findOne.mockResolvedValue(null);
    const ctx = mockContext({ userId: 'intrus' }, { teamId: 'team-1' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });
});
