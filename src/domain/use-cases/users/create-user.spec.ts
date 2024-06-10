import { InMemoryUsersRepository } from 'test/repository/in-memory-users-repository'
import { CreateUserUseCase } from './create-user'
import { BcryptHasher } from '@/cryptography/bcrypt-hasher'
import { UserAlreadyExistsError } from '../errors/use-case-error'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'

let inMemoryUsersRepository: InMemoryUsersRepository
let hashGenerator: BcryptHasher
let encrypter: FakeEncrypter
let sut: CreateUserUseCase

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    hashGenerator = new BcryptHasher()
    encrypter = new FakeEncrypter()

    sut = new CreateUserUseCase(
      inMemoryUsersRepository,
      hashGenerator,
      encrypter,
    )
  })

  it('should be able to create a user', async () => {
    const result = await sut.execute({
      email: 'john@example.com',
      name: 'John Doe',
      username: 'john34',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to create a user with an existing email address', async () => {
    await sut.execute({
      email: 'john@example.com',
      name: 'John Doe',
      username: 'john34',
      password: '123456',
    })

    const userWithSameEmail = {
      email: 'john@example.com',
      name: 'John Doe',
      username: 'john00',
      password: '123456',
    }

    const result = await sut.execute(userWithSameEmail)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not be able to create a user with an existing username', async () => {
    await sut.execute({
      email: 'john2@example.com',
      name: 'John Doe',
      username: 'john34',
      password: '123456',
    })

    const userWithSameUsername = {
      email: 'john@example.com',
      name: 'John Doe',
      username: 'john34',
      password: '123456',
    }

    const result = await sut.execute(userWithSameUsername)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
  it('should return an access token when user is created.', async () => {
    const result = await sut.execute({
      email: 'john@example.com',
      name: 'John Doe',
      username: 'john34',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      accessToken: expect.any(String),
    })
  })
})
