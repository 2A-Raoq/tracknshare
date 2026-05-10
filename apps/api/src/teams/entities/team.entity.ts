import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { TeamMember } from './team-member.entity'
import { ChatMessage } from './chat-message.entity'

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  name: string

  @Column({ length: 10 })
  tag: string

  @Column({ nullable: true, type: 'text' })
  description: string | null

  @Column()
  ownerId: string

  @Column({ unique: true })
  inviteCode: string

  @OneToMany(() => TeamMember, (m) => m.team)
  members: TeamMember[]

  @OneToMany(() => ChatMessage, (m) => m.team)
  messages: ChatMessage[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
