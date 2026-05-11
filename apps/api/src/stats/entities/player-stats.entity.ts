import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Game } from '../../games/entities/game.entity'
import { Season } from '../../seasons/entities/season.entity'

@Entity('player_stats')
@Unique(['userId', 'gameId', 'seasonId'])
export class PlayerStats {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  userId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User

  @Column()
  gameId: string

  @ManyToOne(() => Game)
  @JoinColumn({ name: 'gameId' })
  game: Game

  @Column()
  seasonId: string

  @ManyToOne(() => Season)
  @JoinColumn({ name: 'seasonId' })
  season: Season

  @Column({ default: 0 })
  kills: number

  @Column({ default: 0 })
  deaths: number

  @Column({ default: 0 })
  wins: number

  @Column({ default: 0 })
  losses: number

  @Column({ default: 0 })
  matchesPlayed: number

  @Column({ default: 0 })
  playtimeMinutes: number

  @Column({ type: 'float', default: 0 })
  kdRatio: number

  @Column({ default: 0 })
  winrate: number

  @Column({ default: 0 })
  score: number

  @Column({ default: 'MOCK' })
  provider: string

  @Column({ type: 'timestamp', nullable: true })
  fetchedAt: Date | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
