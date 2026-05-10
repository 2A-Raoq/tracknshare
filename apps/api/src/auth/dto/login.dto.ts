import { IsEmail, IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ example: 'demo@tracknshare.local' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'Demo1234!' })
  @IsString()
  @IsNotEmpty()
  password: string
}
