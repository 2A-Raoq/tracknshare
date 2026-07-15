import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'
import { MESSAGE_MAX_LENGTH } from '../../common/constants'

export class SendPrivateMessageDto {
  @ApiProperty({ example: 'Salut, dispo pour une partie ?', maxLength: MESSAGE_MAX_LENGTH })
  @IsString()
  @MinLength(1)
  @MaxLength(MESSAGE_MAX_LENGTH)
  content: string
}
