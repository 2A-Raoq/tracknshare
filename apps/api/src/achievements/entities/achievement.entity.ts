import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { UserAchievement } from './user-achievement.entity'

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @Column({ type: 'text' })
  description: string

  @Column()
  icon: string

  @Column({ default: 0 })
  points: number

  @OneToMany(() => UserAchievement, (userAchievement) => userAchievement.achievement)
  userAchievements: UserAchievement[]

  @CreateDateColumn()
  createdAt: Date
}
