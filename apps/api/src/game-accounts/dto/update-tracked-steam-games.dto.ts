import { ApiProperty } from '@nestjs/swagger'
import { ArrayUnique, IsArray, IsString, Matches } from 'class-validator'

export class UpdateTrackedSteamGamesDto {
  @ApiProperty({
    type: [String],
    example: ['730', '570'],
    description: 'Steam appIds to track',
  })
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @Matches(/^\d+$/, { each: true, message: 'STEAM_APP_ID_INVALID' })
  appIds: string[]
}
