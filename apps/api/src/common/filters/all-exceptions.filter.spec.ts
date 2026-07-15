import {
  ArgumentsHost,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { AllExceptionsFilter } from './all-exceptions.filter'

interface NormalizedErrorBody {
  success: boolean
  statusCode: number
  message: string | string[]
  error: { code: string; message: string; requestId: string }
}

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter
  let statusMock: jest.Mock
  let jsonMock: jest.Mock

  const createHost = (type = 'http'): ArgumentsHost => {
    jsonMock = jest.fn()
    statusMock = jest.fn().mockReturnValue({ json: jsonMock })
    return {
      getType: () => type,
      switchToHttp: () => ({
        getResponse: () => ({ status: statusMock }),
        getRequest: () => ({}),
      }),
    } as unknown as ArgumentsHost
  }

  const getBody = (): NormalizedErrorBody => {
    const calls = jsonMock.mock.calls as unknown as [NormalizedErrorBody][]
    return calls[0][0]
  }

  beforeEach(() => {
    filter = new AllExceptionsFilter()
  })

  it('normalise un code métier SCREAMING_SNAKE dans error.code', () => {
    filter.catch(new NotFoundException('TEAM_NOT_FOUND'), createHost())

    expect(statusMock).toHaveBeenCalledWith(404)
    const body = getBody()
    expect(body.success).toBe(false)
    expect(body.error.code).toBe('TEAM_NOT_FOUND')
    expect(body.error.message).toBe('Équipe introuvable.')
    expect(body.error.requestId).toEqual(expect.any(String))
  })

  it('conserve les champs legacy message et statusCode (rétro-compat clients)', () => {
    filter.catch(new ConflictException('TEAM_ALREADY_MEMBER'), createHost())

    const body = getBody()
    // Les clients web comparent response.data.message au code métier brut.
    expect(body.message).toBe('TEAM_ALREADY_MEMBER')
    expect(body.statusCode).toBe(409)
  })

  it('mappe les erreurs de validation (message tableau) vers VALIDATION_ERROR', () => {
    const exception = new BadRequestException(['email must be an email', 'password too short'])
    filter.catch(exception, createHost())

    expect(statusMock).toHaveBeenCalledWith(400)
    const body = getBody()
    // Tableau conservé tel quel pour les clients existants.
    expect(body.message).toEqual(['email must be an email', 'password too short'])
    expect(body.error.code).toBe('VALIDATION_ERROR')
    expect(body.error.message).toContain('email must be an email')
  })

  it('mappe une erreur inconnue vers 500 INTERNAL_ERROR sans stack trace', () => {
    filter.catch(new Error('database exploded'), createHost())

    expect(statusMock).toHaveBeenCalledWith(500)
    const body = getBody()
    expect(body.error.code).toBe('INTERNAL_ERROR')
    expect(body.message).toBe('Internal server error')
    expect(JSON.stringify(body)).not.toContain('database exploded')
  })

  it('utilise un code de repli par statut quand le message n’est pas un code métier', () => {
    filter.catch(new BadRequestException('something went wrong'), createHost())

    const body = getBody()
    expect(body.error.code).toBe('VALIDATION_ERROR')
    expect(body.message).toBe('something went wrong')
  })

  it('relance les exceptions hors contexte HTTP (gateways Socket.io)', () => {
    const exception = new Error('ws error')
    expect(() => filter.catch(exception, createHost('ws'))).toThrow(exception)
  })
})
