import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '../users/users.module'
import { FriendRequest } from './entities/friend-request.entity'
import { FriendsController } from './friends.controller'
import { FriendsService } from './friends.service'

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([FriendRequest])],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}
