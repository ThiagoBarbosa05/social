import { Either, left, right } from '@/core/either'
import { UsersRepository } from '@/core/repositories/users-repository'
import { BcryptHasher } from '@/cryptography/bcrypt-hasher'
import { User } from '@/entities/user'
import { UserAlreadyExistsError } from '../errors/use-case-error'
import { Injectable } from '@nestjs/common'
import { Username } from '@/entities/value-objects/username'

type CreateUserUseCaseInput = {
  name: string
  username: string
  email: string
  password: string
  attachmentId?: string
}

type CreateUserUseCaseOutput = Either<
  UserAlreadyExistsError,
  {
    user: User
  }
>

@Injectable()
export class CreateUserUseCase {
  constructor(
    private userRepository: UsersRepository,
    private hashGenerator: BcryptHasher,
  ) {}

  async execute({
    name,
    username,
    email,
    password,
    attachmentId,
  }: CreateUserUseCaseInput): Promise<CreateUserUseCaseOutput> {
    const userAlreadyExists = await this.userRepository.findByEmailOrUsername({
      email,
      username,
    })

    if (userAlreadyExists) {
      return left(new UserAlreadyExistsError('User already exists.'))
    }

    const passwordHashed = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      username: Username.create(username),
      email,
      password: passwordHashed,
      attachmentId,
    })

    await this.userRepository.create(user)

    return right({
      user,
    })
  }
}
