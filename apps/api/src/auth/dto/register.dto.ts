import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({ example: 'demo@tracknshare.local' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'DemoPlayer' })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string

  @ApiProperty({ example: 'Demo1234!' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string
}
