import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

export interface EncryptedPayload {
  iv: string
  authTag: string
  ciphertext: string
}

export function decodeMessageEncryptionKey(encodedKey: string): Buffer {
  const key = Buffer.from(encodedKey, 'base64')

  if (key.length !== 32) {
    throw new Error('MESSAGE_ENCRYPTION_KEY_INVALID')
  }

  return key
}

export function encryptWithKey(key: Buffer, plainText: string): EncryptedPayload {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([
    cipher.update(plainText, 'utf8'),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()

  return {
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    ciphertext: ciphertext.toString('base64'),
  }
}

export function decryptWithKey(
  key: Buffer,
  payload: EncryptedPayload,
): string {
  const iv = Buffer.from(payload.iv, 'base64')
  const authTag = Buffer.from(payload.authTag, 'base64')
  const ciphertext = Buffer.from(payload.ciphertext, 'base64')
  const decipher = createDecipheriv('aes-256-gcm', key, iv)

  decipher.setAuthTag(authTag)

  const plainText = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ])

  return plainText.toString('utf8')
}
