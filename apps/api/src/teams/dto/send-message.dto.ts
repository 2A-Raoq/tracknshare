import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength, MaxLength } from 'class-validator'
import { MESSAGE_MAX_LENGTH } from '../../common/constants'

export class SendMessageDto {
  @ApiProperty({ example: 'Hello team !', maxLength: MESSAGE_MAX_LENGTH })
  @IsString()
  @MinLength(1)
  @MaxLength(MESSAGE_MAX_LENGTH)
  content: string
}
