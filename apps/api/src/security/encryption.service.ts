import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  decodeMessageEncryptionKey,
  decryptWithKey,
  encryptWithKey,
  type EncryptedPayload,
} from './encryption.util'

@Injectable()
export class EncryptionService {
  private readonly key: Buffer

  constructor(private readonly configService: ConfigService) {
    const encodedKey = this.configService.getOrThrow<string>('MESSAGE_ENCRYPTION_KEY')
    this.key = decodeMessageEncryptionKey(encodedKey)
  }

  encrypt(plainText: string): EncryptedPayload {
    try {
      return encryptWithKey(this.key, plainText)
    } catch {
      throw new InternalServerErrorException('MESSAGE_ENCRYPTION_UNAVAILABLE')
    }
  }

  decrypt(payload: EncryptedPayload): string {
    try {
      return decryptWithKey(this.key, payload)
    } catch {
      throw new InternalServerErrorException('MESSAGE_CONTENT_UNAVAILABLE')
    }
  }
}
