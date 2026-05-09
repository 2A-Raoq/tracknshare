import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { UsersModule } from '../users/users.module'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'secret',
    }),
  ],
  controllers: [AuthController], // 🔥 OBLIGATOIRE
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}