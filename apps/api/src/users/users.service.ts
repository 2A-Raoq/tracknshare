import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

interface User {
  id: string
  email: string
  password: string
  steamId?: string
}

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: '1',
      email: 'test@test.com',
      password: bcrypt.hashSync('password123', 10),
    },
  ]

  async findByEmail(email: string) {
    return this.users.find(u => u.email === email)
  }

  async findById(id: string) {
    return this.users.find(u => u.id === id)
  }

  async findBySteamId(steamId: string) {
    return this.users.find(
      (u) => u.steamId === steamId,
    )
  }

  async create(userData: any) {
    const user = { ...userData, id: Date.now().toString() }
    this.users.push(user)
    return user
  }
}