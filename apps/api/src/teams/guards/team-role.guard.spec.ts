import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TeamRoleGuard } from './team-role.guard';
import { TeamMember, TeamRole } from '../entities/team-member.entity';

function mockContext(user: unknown, params: unknown): ExecutionContext {
  const req: Record<string, unknown> = { user, params };
  return {
    switchToHttp: () => ({ getRequest: () => req }),
  } as unknown as ExecutionContext;
}

describe('TeamRoleGuard', () => {
  let guard: TeamRoleGuard;
  let memberRepo: { findOne: jest.Mock };

  beforeEach(async () => {
    memberRepo = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamRoleGuard,
        { provide: getRepositoryToken(TeamMember), useValue: memberRepo },
      ],
    }).compile();

    guard = module.get(TeamRoleGuard);
  });

  it('autorise un capitaine', async () => {
    memberRepo.findOne.mockResolvedValue({
      teamId: 'team-1',
      userId: 'cap',
      role: TeamRole.CAPTAIN,
    });
    const ctx = mockContext({ userId: 'cap' }, { teamId: 'team-1' });
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
  });

  it('refuse un simple membre', async () => {
    memberRepo.findOne.mockResolvedValue({
      teamId: 'team-1',
      userId: 'mbr',
      role: TeamRole.MEMBER,
    });
    const ctx = mockContext({ userId: 'mbr' }, { teamId: 'team-1' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('refuse un non-membre', async () => {
    memberRepo.findOne.mockResolvedValue(null);
    const ctx = mockContext({ userId: 'intrus' }, { teamId: 'team-1' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('refuse une requête sans utilisateur ou sans équipe', async () => {
    const ctx = mockContext(undefined, undefined);
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });
});
