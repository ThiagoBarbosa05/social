import {
  FindByEmailOrUsernameParameters,
  UsersRepository,
} from '@/core/repositories/users-repository'
import { User } from '@/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(user: User) {
    this.items.push(user)
  }

  async findByEmailOrUsername({
    email,
    username,
  }: FindByEmailOrUsernameParameters) {
    const user = this.items.find(
      (user) => user.email === email || user.username === username,
    )

    if (!user) return null

    return user
  }
}
