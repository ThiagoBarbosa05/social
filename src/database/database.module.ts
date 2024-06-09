import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { UsersRepository } from '@/core/repositories/users-repository'
import { PrismaUsersRepository } from './repositories/prisma-users-repository'

@Module({
  providers: [
    PrismaService,
    { provide: UsersRepository, useClass: PrismaUsersRepository },
  ],
  exports: [PrismaService, UsersRepository],
})
export class DatabaseModule {}
