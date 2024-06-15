import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { LoginDto, SignupDto } from '../../src/auth/dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as request from 'supertest';
import { ErrorMessages } from '../../src/shared/error-messages';

describe('AuthController (e2e)', () => {
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

  it('should be able to register a new user (POST /auth/signup)', async () => {
    const signUpDto: SignupDto = {
      email: 'test1@gmail.com',
      password: 'password',
    };

    return await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send(signUpDto)
      .expect(201);
  });

  it("shouldn't be able to register a new user with an existing email (POST /auth/signup)", async () => {
    const signUpDto: SignupDto = {
      email: 'test2@gmail.com',
      password: 'password',
    };

    await request(app.getHttpServer()).post('/api/auth/signup').send(signUpDto);

    return await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send(signUpDto)
      .expect(400)
      .expect(res => {
        expect(res.body.message).toBe(ErrorMessages.USER_ALREADY_EXISTS);
      });
  });

  it("shouldn't be able to register a new user with an invalid email (POST /auth/signup)", async () => {
    const signUpDto: SignupDto = {
      email: 'invalid-email',
      password: 'password',
    };

    return await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send(signUpDto)
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain('email must be an email');
      });
  });

  it('should be able to login with the registered user (POST /auth/login)', async () => {
    const signUpDto: SignupDto = {
      email: 'test3@gmail.com',
      password: 'password',
    };
    const loginDto: LoginDto = {
      ...signUpDto,
    };

    await request(app.getHttpServer()).post('/api/auth/signup').send(signUpDto);

    return await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(loginDto)
      .expect(200);
  });

  it("shouldn't be able to login with an unregistered user (POST /auth/login)", async () => {
    const loginDto: LoginDto = {
      email: 'test4@gmail.com',
      password: 'password',
    };

    return await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(loginDto)
      .expect(400)
      .expect(res => {
        expect(res.body.message).toBe(ErrorMessages.INVALID_CREDENTIALS);
      });
  });

  it("shouldn't be able to login with an incorrect password (POST /auth/login)", async () => {
    const signUpDto: SignupDto = {
      email: 'test5@gmail.com',
      password: 'password',
    };

    const loginDto: LoginDto = {
      ...signUpDto,
      password: 'incorrect',
    };

    await request(app.getHttpServer()).post('/api/auth/signup').send(signUpDto);

    return await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(loginDto)
      .expect(400)
      .expect(res => {
        expect(res.body.message).toBe(ErrorMessages.INVALID_CREDENTIALS);
      });
  });

  afterAll(async () => {
    await app.close();
    await prisma.cleanup();
  });
});
