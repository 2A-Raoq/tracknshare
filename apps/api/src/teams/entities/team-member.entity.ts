import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm'
import { Team } from './team.entity'
import { User } from '../../users/entities/user.entity'

export enum TeamRole {
  CAPTAIN = 'CAPTAIN',
  MEMBER = 'MEMBER',
}

@Entity('team_members')
@Unique(['teamId', 'userId'])
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  teamId: string

  @Column()
  userId: string

  @Column({ default: TeamRole.MEMBER })
  role: string

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  joinedAt: Date

  @ManyToOne(() => Team, (t) => t.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: Team

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
