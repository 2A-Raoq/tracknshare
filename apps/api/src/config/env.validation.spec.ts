import { validateEnv } from './env.validation'

// Clé base64 valide de 32 octets (AES-256).
const VALID_KEY = Buffer.alloc(32, 1).toString('base64')

describe('validateEnv', () => {
  const validConfig = {
    JWT_SECRET: 'a-sufficiently-long-secret',
    MESSAGE_ENCRYPTION_KEY: VALID_KEY,
  }

  it('accepte une configuration valide et la renvoie', () => {
    expect(validateEnv({ ...validConfig })).toEqual(validConfig)
  })

  it('rejette un JWT_SECRET absent', () => {
    expect(() => validateEnv({ MESSAGE_ENCRYPTION_KEY: VALID_KEY })).toThrow(/JWT_SECRET/)
  })

  it('rejette un JWT_SECRET trop court', () => {
    expect(() => validateEnv({ JWT_SECRET: 'court', MESSAGE_ENCRYPTION_KEY: VALID_KEY })).toThrow(
      /JWT_SECRET/,
    )
  })

  it('rejette une clé de chiffrement absente', () => {
    expect(() => validateEnv({ JWT_SECRET: validConfig.JWT_SECRET })).toThrow(
      /MESSAGE_ENCRYPTION_KEY/,
    )
  })

  it('rejette une clé de chiffrement qui ne fait pas 32 octets', () => {
    expect(() =>
      validateEnv({
        JWT_SECRET: validConfig.JWT_SECRET,
        MESSAGE_ENCRYPTION_KEY: Buffer.alloc(16, 1).toString('base64'),
      }),
    ).toThrow(/32 octets/)
  })
})
