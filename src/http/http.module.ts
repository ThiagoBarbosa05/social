import { Module } from '@nestjs/common'
import { EnvModule } from '@/env/env.module'
import { UsersController } from './controllers/users.controller'
import { CreateUserUseCase } from '@/domain/use-cases/users/create-user'
import { DatabaseModule } from '@/database/database.module'
import { CryptographyModule } from '@/cryptography/cryptography.module'
import { AuthenticateUseCase } from '@/domain/use-cases/auth/authenticate'
import { AuthController } from './controllers/auth.controller'
import { AttachmentController } from './controllers/attachment.controller'
import { StorageModule } from '@/storage/storage.module'
import { UploadAttachmentUseCase } from '@/domain/use-cases/attachment/upload-attachment'

@Module({
  imports: [EnvModule, DatabaseModule, CryptographyModule, StorageModule],
  providers: [CreateUserUseCase, AuthenticateUseCase, UploadAttachmentUseCase],
  controllers: [UsersController, AuthController, AttachmentController],
})
export class HttpModule {}
