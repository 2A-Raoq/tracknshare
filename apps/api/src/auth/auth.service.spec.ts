import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'

jest.mock('bcrypt')

describe('AuthService', () => {
  let service: AuthService
  let usersService: jest.Mocked<
    Pick<UsersService, 'create' | 'findByEmailWithPasswordHash' | 'toPublic'>
  >
  let jwtService: jest.Mocked<Pick<JwtService, 'sign'>>

  const baseUser = {
    id: 'user-1',
    email: 'demo@tracknshare.local',
    username: 'DemoPlayer',
    role: 'PLAYER',
    passwordHash: 'hashed',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
      findByEmailWithPasswordHash: jest.fn(),
      toPublic: jest.fn((user: Record<string, unknown>) => {
        const rest = { ...user }
        delete rest.passwordHash
        return rest
      }),
    }
    jwtService = { sign: jest.fn().mockReturnValue('signed.jwt.token') }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile()

    service = module.get(AuthService)
  })

  describe('register', () => {
    it('crée l’utilisateur, signe un token et ne renvoie jamais le hash', async () => {
      usersService.create.mockResolvedValue(baseUser)

      const result = await service.register(baseUser.email, baseUser.username, 'Demo1234!')

      expect(usersService.create).toHaveBeenCalledWith({
        email: baseUser.email,
        username: baseUser.username,
        password: 'Demo1234!',
      })
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: baseUser.id,
        role: baseUser.role,
      })
      expect(result.accessToken).toBe('signed.jwt.token')
      expect(result.user).not.toHaveProperty('passwordHash')
    })
  })

  describe('login', () => {
    it('renvoie un token quand les identifiants sont valides', async () => {
      usersService.findByEmailWithPasswordHash.mockResolvedValue(baseUser)
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never)

      const result = await service.login(baseUser.email, 'Demo1234!')

      expect(compareSpy).toHaveBeenCalledWith('Demo1234!', baseUser.passwordHash)
      expect(result.accessToken).toBe('signed.jwt.token')
      expect(result.user).not.toHaveProperty('passwordHash')
      compareSpy.mockRestore()
    })

    it('rejette avec un message générique quand l’email est inconnu', async () => {
      usersService.findByEmailWithPasswordHash.mockResolvedValue(null)

      await expect(service.login('inconnu@tracknshare.local', 'x')).rejects.toThrow(
        UnauthorizedException,
      )
      await expect(service.login('inconnu@tracknshare.local', 'x')).rejects.toThrow(
        'AUTH_INVALID_CREDENTIALS',
      )
    })

    it('rejette avec le même message générique quand le mot de passe est faux', async () => {
      usersService.findByEmailWithPasswordHash.mockResolvedValue(baseUser)
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never)

      await expect(service.login(baseUser.email, 'mauvais')).rejects.toThrow(
        'AUTH_INVALID_CREDENTIALS',
      )
      compareSpy.mockRestore()
    })
  })
})
