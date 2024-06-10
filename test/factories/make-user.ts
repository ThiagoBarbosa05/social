import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaUserMapper } from '@/database/mappers/prisma-user-mapper'
import { PrismaService } from '@/database/prisma.service'
import { User, UserProps } from '@/domain/entities/user'
import { Username } from '@/domain/entities/value-objects/username'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeUserEntity(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      name: faker.person.firstName(),
      username: Username.create(faker.internet.userName()),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )
  return user
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}) {
    const user = makeUserEntity(data)

    const userOnDatabase = await this.prisma.user.create({
      data: {
        ...PrismaUserMapper.toPrisma(user),
      },
    })

    return userOnDatabase
  }
}
