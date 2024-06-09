import { Module } from '@nestjs/common'
import { EnvModule } from '@/env/env.module'
import { UsersController } from './controllers/users.controller'
import { CreateUserUseCase } from '@/use-cases/users/create-user'
import { DatabaseModule } from '@/database/database.module'
import { CryptographyModule } from '@/cryptography/cryptography.module'

@Module({
  imports: [EnvModule, DatabaseModule, CryptographyModule],
  providers: [CreateUserUseCase],
  controllers: [UsersController],
})
export class HttpModule {}
