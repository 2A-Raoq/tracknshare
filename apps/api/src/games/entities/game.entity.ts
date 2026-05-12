import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  slug: string

  @Column({ default: 'PC' })
  platform: string

  @Column({ default: false })
  isTeamBased: boolean

  @Column({ default: 'mock' })
  apiProvider: string

  @Column({ type: 'varchar', length: 64, nullable: true })
  externalId: string | null

  @Column({ type: 'text', nullable: true })
  imageUrl: string | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
