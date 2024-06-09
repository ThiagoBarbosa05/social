import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from '@/entities/user'
import { Username } from '@/entities/value-objects/username'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        email: raw.email,
        name: raw.name,
        password: raw.passwordHash,
        username: Username.create(raw.username),
        attachmentId: raw.attachmentId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      name: user.name,
      passwordHash: user.password,
      attachmentId: user.attachmentId,
    }
  }
}
