import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { ConversationParticipant } from './conversation-participant.entity'
import { PrivateMessage } from './private-message.entity'

export enum ConversationType {
  DIRECT = 'DIRECT',
}

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ default: ConversationType.DIRECT })
  type: ConversationType

  @OneToMany(() => ConversationParticipant, (participant) => participant.conversation)
  participants: ConversationParticipant[]

  @OneToMany(() => PrivateMessage, (message) => message.conversation)
  messages: PrivateMessage[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
