import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class JoinTeamDto {
  @ApiProperty({ example: 'DEMO0001' })
  @IsString()
  @Length(6, 20)
  inviteCode: string
}
