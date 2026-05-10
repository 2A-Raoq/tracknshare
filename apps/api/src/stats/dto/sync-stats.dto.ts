import { IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class SyncStatsDto {
  @ApiPropertyOptional({ description: 'Game ID to sync (defaults to first active game)' })
  @IsOptional()
  @IsString()
  gameId?: string
}
