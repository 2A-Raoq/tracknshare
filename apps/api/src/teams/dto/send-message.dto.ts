import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength, MaxLength } from 'class-validator'

export class SendMessageDto {
  @ApiProperty({ example: 'Hello team !' })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string
}
