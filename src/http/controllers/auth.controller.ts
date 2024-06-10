import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
} from '@nestjs/common'
import {
  AuthBodySchema,
  authBodySchema,
} from '../validation-schemas/auth-schemas'
import { Response } from 'express'
import { AuthenticateUseCase } from '@/domain/use-cases/auth/authenticate'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { InvalidCredentialsError } from '@/domain/use-cases/errors/invalid-credentials-error'
import { IsPublic } from '../auth/public'

const authValidationPipe = new ZodValidationPipe(authBodySchema)

@Controller('/auth')
export class AuthController {
  constructor(private authenticate: AuthenticateUseCase) {}

  @Post()
  @HttpCode(201)
  @IsPublic()
  async handle(
    @Body(authValidationPipe) body: AuthBodySchema,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = body
    const result = await this.authenticate.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    })

    return { accessToken }
  }
}
