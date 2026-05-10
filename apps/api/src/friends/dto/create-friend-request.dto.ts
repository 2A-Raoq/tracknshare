import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class CreateFriendRequestDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  recipientId: string
}
