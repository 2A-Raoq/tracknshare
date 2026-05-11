import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'

@Entity('game_accounts')
@Unique(['userId', 'platform'])
@Unique(['platform', 'externalId'])
export class GameAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  userId: string

  @Column()
  platform: string

  @Column()
  externalId: string

  @Column({ nullable: true })
  externalUsername: string | null

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  linkedAt: Date

  @Column({ type: 'timestamptz', nullable: true })
  lastSyncAt: Date | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
