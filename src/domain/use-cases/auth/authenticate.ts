import { Either, left, right } from '@/core/either'
import { UsersRepository } from '@/core/repositories/users-repository'
import { BcryptHasher } from '@/cryptography/bcrypt-hasher'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { Encrypter } from '@/domain/cryptography/encrypter'
import { Injectable } from '@nestjs/common'

type AuthenticateUseCaseInput = {
  email?: string
  password: string
}

type AuthenticateUseCaseOutput = Either<
  InvalidCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashCompare: BcryptHasher,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseInput): Promise<AuthenticateUseCaseOutput> {
    const user = await this.usersRepository.findByEmailOrUsername({
      email,
    })

    if (!user) {
      return left(new InvalidCredentialsError('Invalid credentials.'))
    }

    const isPasswordMatch = await this.hashCompare.compare(
      password,
      user.password,
    )

    if (!isPasswordMatch) {
      return left(new InvalidCredentialsError('Invalid credentials.'))
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
