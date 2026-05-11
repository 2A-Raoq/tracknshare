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

  @Column({ type: 'text', nullable: true, select: false })
  content: string | null

  @Column({ type: 'text', nullable: true, select: false })
  encryptedContent: string | null

  @Column({ type: 'varchar', length: 64, nullable: true, select: false })
  iv: string | null

  @Column({ type: 'varchar', length: 64, nullable: true, select: false })
  authTag: string | null

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
