import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { UsersRepository } from '@/core/repositories/users-repository'
import { PrismaUsersRepository } from './repositories/prisma-users-repository'
import { AttachmentsRepository } from '@/core/repositories/attachments-repository'
import { PrismaAttachmentsRepository } from './repositories/prisma-attachments-repository'

@Module({
  providers: [
    PrismaService,
    { provide: UsersRepository, useClass: PrismaUsersRepository },
    { provide: AttachmentsRepository, useClass: PrismaAttachmentsRepository },
  ],
  exports: [PrismaService, UsersRepository, AttachmentsRepository],
})
export class DatabaseModule {}
