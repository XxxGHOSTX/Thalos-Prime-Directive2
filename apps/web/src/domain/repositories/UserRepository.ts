// Domain Repository Interface: User Repository
// Defines the contract for user data access

import { User, UserId } from '../entities/User'

export interface UserRepository {
  findById(id: UserId): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(): Promise<User[]>
  save(user: User): Promise<void>
  delete(id: UserId): Promise<void>
}
