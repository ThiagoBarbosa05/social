import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  Res,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import {
  CreateUserBodySchema,
  createUserBodySchema,
} from '../validation-schemas/user-schemas'
import { CreateUserUseCase } from '@/domain/use-cases/users/create-user'
import { UserAlreadyExistsError } from '@/domain/use-cases/errors/use-case-error'
import { IsPublic } from '../auth/public'
import { Response } from 'express'

const createUserValidationPipe = new ZodValidationPipe(createUserBodySchema)

@Controller('/users')
export class UsersController {
  constructor(private createUser: CreateUserUseCase) {}

  @Post()
  @IsPublic()
  @HttpCode(201)
  async create(
    @Body(createUserValidationPipe) body: CreateUserBodySchema,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { attachmentId, email, name, password, username } = body

    const result = await this.createUser.execute({
      email,
      password,
      name,
      username,
      attachmentId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
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
