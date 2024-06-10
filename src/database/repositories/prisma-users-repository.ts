import {
  FindByEmailOrUsernameParameters,
  UsersRepository,
} from '@/core/repositories/users-repository'
import { User } from '@/domain/entities/user'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User) {
    const PrismaUser = PrismaUserMapper.toPrisma(user)
    await this.prisma.user.create({
      data: PrismaUser,
    })
  }

  async findByEmailOrUsername({
    email,
    username,
  }: FindByEmailOrUsernameParameters) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
        username,
      },
    })

    if (!user) return null

    return PrismaUserMapper.toDomain(user)
  }
}
