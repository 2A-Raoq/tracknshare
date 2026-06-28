import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

jest.mock('bcrypt');

const bcryptHash = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;

describe('UsersService', () => {
  let service: UsersService;
  let repo: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    repo = {
      findOne: jest.fn(),
      create: jest.fn((data: Record<string, unknown>) => data),
      save: jest.fn((data: Record<string, unknown>) =>
        Promise.resolve({ id: 'user-1', ...data }),
      ),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
        { provide: DataSource, useValue: { query: jest.fn(), transaction: jest.fn() } },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  describe('create', () => {
    it('hashe le mot de passe et ne stocke jamais le mot de passe en clair', async () => {
      repo.findOne.mockResolvedValue(null);
      bcryptHash.mockResolvedValue('hashed-pw' as never);

      const user = await service.create({
        email: 'new@tracknshare.local',
        username: 'NewPlayer',
        password: 'Demo1234!',
      });

      expect(bcryptHash).toHaveBeenCalledWith('Demo1234!', 10);
      expect(repo.create).toHaveBeenCalledWith({
        email: 'new@tracknshare.local',
        username: 'NewPlayer',
        passwordHash: 'hashed-pw',
      });
      expect(user.passwordHash).toBe('hashed-pw');
    });

    it('rejette si l’email existe déjà', async () => {
      repo.findOne.mockResolvedValue({ id: 'existing' });

      await expect(
        service.create({
          email: 'dup@tracknshare.local',
          username: 'Dup',
          password: 'x',
        }),
      ).rejects.toThrow(ConflictException);
      expect(bcryptHash).not.toHaveBeenCalled();
    });
  });

  describe('toPublic', () => {
    it('retire le passwordHash de l’objet utilisateur', () => {
      const user = {
        id: 'user-1',
        email: 'demo@tracknshare.local',
        username: 'DemoPlayer',
        role: 'PLAYER',
        passwordHash: 'secret',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = service.toPublic(user);

      expect(result).not.toHaveProperty('passwordHash');
      expect(result.username).toBe('DemoPlayer');
    });
  });

  describe('searchByUsername', () => {
    it('renvoie une liste vide pour une requête vide', async () => {
      const result = await service.searchByUsername('   ');
      expect(result).toEqual([]);
      expect(repo.find).not.toHaveBeenCalled();
    });

    it('exclut l’utilisateur courant des résultats et masque le hash', async () => {
      repo.find.mockResolvedValue([
        { id: 'user-1', username: 'DemoPlayer', passwordHash: 'x' },
        { id: 'user-2', username: 'DemoMate', passwordHash: 'y' },
      ]);

      const result = await service.searchByUsername('demo', 'user-1');

      expect(result).toEqual([
        { id: 'user-2', username: 'DemoMate', avatar: null },
      ]);
      expect(result[0]).not.toHaveProperty('passwordHash');
    });
  });
});
