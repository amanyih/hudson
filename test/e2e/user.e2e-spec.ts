import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as request from 'supertest';
import { ErrorMessages } from '../../src/shared/error-messages';
import { CreateUserDto } from '../../src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    await prisma.cleanup();
  });

  it('should be able to register a new user (POST /api/users)', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test6@gmail.com',
      password: 'password',
    };

    return await request(app.getHttpServer())
      .post('/api/user')
      .send(createUserDto)
      .expect(201);
  });

  it("shouldn't be able to register a new user with an existing email (POST /api/users)", async () => {
    const createUserDto: CreateUserDto = {
      email: 'test7@gmail.com',
      password: 'password',
    };

    await request(app.getHttpServer()).post('/api/user').send(createUserDto);

    return await request(app.getHttpServer())
      .post('/api/user')
      .send(createUserDto)
      .expect(400)
      .expect(res => {
        expect(res.body.message).toBe(ErrorMessages.USER_ALREADY_EXISTS);
      });
  });

  it("shouldn't be able to register a new user with an invalid email (POST /api/users)", async () => {
    const createUserDto: CreateUserDto = {
      email: 'test8',
      password: 'password',
    };

    return await request(app.getHttpServer())
      .post('/api/user')
      .send(createUserDto)
      .expect(400)
      .expect(res => {
        expect(res.body.message).toStrictEqual(['email must be an email']);
      });
  });

  it('should be able to get all users (GET /api/users)', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@gmail.com',
      password: 'password',
    };

    await request(app.getHttpServer()).post('/api/user').send(createUserDto);

    return await request(app.getHttpServer())
      .get('/api/user')
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(1);
      });
  });

  it('should be able to get a user by id (GET /api/users/:id)', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@gmail.com',
      password: 'password',
    };

    const { body: user } = await request(app.getHttpServer())
      .post('/api/user')
      .send(createUserDto);

    return await request(app.getHttpServer())
      .get(`/api/user/${user.id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.id).toBe(user.id);
      });
  });

  it("shouldn't be able to get a user by an invalid id (GET /api/users/:id)", async () => {
    return await request(app.getHttpServer())
      .get('/api/user/invalid-id')
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe(ErrorMessages.NOT_FOUND);
      });
  });

  it('should throw an error when invalid pagination query params are provided (GET /api/users)', async () => {
    return await request(app.getHttpServer())
      .get('/api/user?page=invalid&limit=invalid')
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain(
          ErrorMessages.PAGE_MUST_BE_A_NUMBER_ERROR,
        );
      });
  });

  it('should throw an error when invalid page query param is provided (GET /api/users)', async () => {
    return await request(app.getHttpServer())
      .get('/api/user?page=0&limit=1')
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain(
          ErrorMessages.PAGE_MUST_BE_GREATER_THAN_ZERO,
        );
      });
  });

  it('should throw an error when invalid limit query param is provided (GET /api/users)', async () => {
    return await request(app.getHttpServer())
      .get('/api/user?page=1&limit=0')
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain(
          ErrorMessages.LIMIT_MUST_BE_GREATER_THAN_ZERO,
        );
      });
  });

  it('should be able to update a user (PATCH /api/users/:id)', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@email.com',
      password: 'password',
    };

    const updateUserDto: UpdateUserDto = {
      email: 'updated@gmail.com',
    };

    const { body: user } = await request(app.getHttpServer())
      .post('/api/user')
      .send(createUserDto)
      .expect(201);

    return await request(app.getHttpServer())
      .patch(`/api/user/${user.id}`)
      .send(updateUserDto)
      .expect(200)
      .expect(res => {
        expect(res.body.email).toBe(updateUserDto.email);
      });
  });

  it("shouldn't be able able to update a user with non-existing id (PATCH /api/users/:id)", async () => {
    const updateUserDto: UpdateUserDto = {
      email: 'test@gmail.com',
    };

    return await request(app.getHttpServer())
      .patch('/api/user/invalid-id')
      .send(updateUserDto)
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe(ErrorMessages.NOT_FOUND);
      });
  });

  it("shouldn't be able to update a user with an invalid email (PATCH /api/users/:id)", async () => {
    const updateUserDto: UpdateUserDto = {
      email: 'invalid-email',
    };

    return await request(app.getHttpServer())
      .patch('/api/user/invalid-id')
      .send(updateUserDto)
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain('email must be an email');
      });
  });

  it('should be able to delete a user (DELETE /api/users/:id)', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@gmail.com',
      password: 'password',
    };

    const { body: user } = await request(app.getHttpServer())
      .post('/api/user')
      .send(createUserDto)
      .expect(201);

    return await request(app.getHttpServer())
      .delete(`/api/user/${user.id}`)
      .expect(200)
      .expect(res => {
        expect(res.body).toStrictEqual({ deleted: true });
      });
  });

  it("shouldn't be able to delete a user with non-existing id (DELETE /api/users/:id)", async () => {
    return await request(app.getHttpServer())
      .delete('/api/user/invalid-id')
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe(ErrorMessages.NOT_FOUND);
      });
  });

  afterAll(async () => {
    await app.close();
    await prisma.cleanup();
  });
});
