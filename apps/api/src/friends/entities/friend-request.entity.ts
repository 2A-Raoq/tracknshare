import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

export enum FriendRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REFUSED = 'REFUSED',
  CANCELLED = 'CANCELLED',
}

@Entity('friend_requests')
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  senderId: string

  @Column()
  recipientId: string

  @Column({ default: FriendRequestStatus.PENDING })
  status: FriendRequestStatus

  @Column({ type: 'timestamptz', nullable: true })
  respondedAt: Date | null

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender: User

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipientId' })
  recipient: User

  @CreateDateColumn()
  createdAt: Date
}
