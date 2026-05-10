import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Conversation } from './conversation.entity'
import { User } from '../../users/entities/user.entity'

@Entity('private_messages')
export class PrivateMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  conversationId: string

  @Column()
  senderId: string

  @Column({ length: 1000 })
  content: string

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender: User

  @CreateDateColumn()
  createdAt: Date

  @Column({ type: 'timestamptz', nullable: true })
  editedAt: Date | null

  @Column({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null
}
