import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
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

  @Column({ type: 'varchar', length: 50, nullable: true })
  iconKey: string | null

  @Column({ type: 'integer', default: 0 })
  points: number

  @Column({ type: 'integer', default: 1 })
  targetValue: number

  @Column({ type: 'varchar', length: 50, default: 'GENERAL' })
  category: string

  @OneToMany(() => UserAchievement, (ua) => ua.achievement)
  userAchievements: UserAchievement[]

  @CreateDateColumn()
  createdAt: Date
}
