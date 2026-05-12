import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'

@Entity('steam_tracked_games')
@Unique(['userId', 'provider', 'externalGameId'])
export class SteamTrackedGame {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  userId: string

  @Column()
  gameAccountId: string

  @Column({ default: 'STEAM' })
  provider: string

  @Column({ type: 'varchar', length: 32 })
  externalGameId: string

  @Column({ type: 'varchar', length: 160 })
  name: string

  @Column({ default: 0 })
  playtimeForever: number

  @Column({ type: 'int', nullable: true })
  playtime2Weeks: number | null

  @Column({ type: 'text', nullable: true })
  imageUrl: string | null

  @Column({ default: false })
  isTracked: boolean

  @Column({ type: 'timestamptz' })
  lastSeenAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
