import { IsString, MinLength, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiProperty({ example: 'NouveauPseudo' })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string
}
