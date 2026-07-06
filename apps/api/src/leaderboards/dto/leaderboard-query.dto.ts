import { IsInt, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class LeaderboardQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gameId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seasonId?: string

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20

  @ApiPropertyOptional({
    description: 'Opaque cursor for cursor-based pagination (replaces page when provided)',
  })
  @IsOptional()
  @IsString()
  cursor?: string
}
