import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import {
  CreateUserBodySchema,
  createUserBodySchema,
} from '../validation-schemas/user-schemas'
import { CreateUserUseCase } from '@/use-cases/users/create-user'
import { UserAlreadyExistsError } from '@/use-cases/errors/use-case-error'

const createUserValidationPipe = new ZodValidationPipe(createUserBodySchema)

@Controller('/users')
export class UsersController {
  constructor(private createUser: CreateUserUseCase) {}
  @Post()
  @HttpCode(201)
  async create(@Body(createUserValidationPipe) body: CreateUserBodySchema) {
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
  }
}
