import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches } from 'class-validator'

export class LinkSteamAccountDto {
  @ApiProperty({ description: 'SteamID64 public' })
  @IsString()
  @Matches(/^\d{17}$/, { message: 'STEAM_ID_INVALID' })
  steamId: string
}
