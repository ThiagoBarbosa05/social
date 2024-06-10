import { BcryptHasher } from '@/cryptography/bcrypt-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { InMemoryUsersRepository } from 'test/repository/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { makeUserEntity } from 'test/factories/make-user'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let hashCompare: BcryptHasher
let encrypter: FakeEncrypter
let sut: AuthenticateUseCase

describe('Authenticate', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    hashCompare = new BcryptHasher()
    encrypter = new FakeEncrypter()
    sut = new AuthenticateUseCase(
      inMemoryUsersRepository,
      hashCompare,
      encrypter,
    )
  })

  it('should be able to authenticate a user', async () => {
    const user = makeUserEntity({
      password: await hashCompare.hash('123456'),
    })

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      email: user.email,
      password: '123456',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toMatchObject({
      accessToken: expect.any(String),
    })
  })
  it('should not be able to authenticate with invalid credentials.', async () => {
    const user = makeUserEntity({
      password: await hashCompare.hash('123456'),
    })

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      email: 'wrongemail@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
