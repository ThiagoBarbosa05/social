import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { HttpModule } from './http/http.module'
import { EnvModule } from './env/env.module'
import { PrismaService } from './database/prisma.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),

    HttpModule,
    EnvModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
