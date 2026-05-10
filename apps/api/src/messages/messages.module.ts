import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '../users/users.module'
import { Conversation } from './entities/conversation.entity'
import { ConversationParticipant } from './entities/conversation-participant.entity'
import { PrivateMessage } from './entities/private-message.entity'
import { MessagesService } from './messages.service'
import { MessagesController } from './messages.controller'
import { MessagesGateway } from './messages.gateway'
import { ConversationParticipantGuard } from './guards/conversation-participant.guard'

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    TypeOrmModule.forFeature([Conversation, ConversationParticipant, PrivateMessage]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway, ConversationParticipantGuard],
  exports: [MessagesService, ConversationParticipantGuard],
})
export class MessagesModule {}
