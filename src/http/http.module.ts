import { Module } from '@nestjs/common'
import { EnvModule } from '@/env/env.module'
import { UsersController } from './controllers/users.controller'
import { CreateUserUseCase } from '@/domain/use-cases/users/create-user'
import { DatabaseModule } from '@/database/database.module'
import { CryptographyModule } from '@/cryptography/cryptography.module'
import { AuthenticateUseCase } from '@/domain/use-cases/auth/authenticate'
import { AuthController } from './controllers/auth.controller'

@Module({
  imports: [EnvModule, DatabaseModule, CryptographyModule],
  providers: [CreateUserUseCase, AuthenticateUseCase],
  controllers: [UsersController, AuthController],
})
export class HttpModule {}
