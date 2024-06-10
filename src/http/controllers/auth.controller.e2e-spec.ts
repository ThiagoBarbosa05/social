import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[POST] /auth', async () => {
    await userFactory.makePrismaUser({
      email: 'john@example.com',
      password: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer()).post('/auth').send({
      email: 'john@example.com',
      password: '123456',
    })
    expect(response.statusCode).toBe(201)

    expect(response.body).toMatchObject({
      accessToken: expect.any(String),
    })
  })
})
