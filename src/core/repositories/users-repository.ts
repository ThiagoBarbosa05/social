import { User } from '@/entities/user'

export interface FindByEmailOrUsernameParameters {
  email: string
  username: string
}

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>
  abstract findByEmailOrUsername({
    email,
    username,
  }: FindByEmailOrUsernameParameters): Promise<User | null>
}
