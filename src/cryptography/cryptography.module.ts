import { Module } from '@nestjs/common'
import { BcryptHasher } from './bcrypt-hasher'
import { Encrypter } from '@/domain/cryptography/encrypter'
import { JwtEncrypter } from './jwt-encrypter'

@Module({
  providers: [BcryptHasher, { provide: Encrypter, useClass: JwtEncrypter }],
  exports: [BcryptHasher, Encrypter],
})
export class CryptographyModule {}
