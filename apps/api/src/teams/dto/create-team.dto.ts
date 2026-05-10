import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator'

export class CreateTeamDto {
  @ApiProperty({ example: 'Track Masters' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string

  @ApiProperty({ example: 'TMS' })
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  tag: string

  @ApiPropertyOptional({ example: 'Team de démonstration' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string
}
