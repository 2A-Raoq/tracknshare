import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Team } from './team.entity'
import { User } from '../../users/entities/user.entity'

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  teamId: string

  @Column()
  senderId: string

  @Column({ length: 1000 })
  content: string

  @ManyToOne(() => Team, (t) => t.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: Team

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User

  @CreateDateColumn()
  createdAt: Date
}
