import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { CreateResultDto } from '../../src/result/dto/create-result.dto';
import { MODE, SUBMODE } from '../../src/shared/types/types.config';
import * as request from 'supertest';
import { SignupDto } from '../../src/auth/dto';

describe('ResultController (e2e)', () => {
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
    await prisma.result.deleteMany();
  });

  it('should be able to create a new result (POST /results)', async () => {
    //get user id
    const signupDto: SignupDto = {
      email: 'test@gmail.com',
      password: 'password',
    };

    const user = await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send(signupDto)
      .expect(201);

    const result: CreateResultDto = {
      accuracy: 50,
      charactersTotal: 100,
      duration: 60,
      keyDuration: [0.1, 0.2, 0.3],
      keySpacing: [0.1, 0.2, 0.3],
      mode: MODE.TIME,
      numbers: true,
      punctuation: true,
      rawWpm: 50,
      testLanguage: 'en',
      submode: SUBMODE.FIFTEEN_SECONDS,
      userId: user.body.id,
      wpm: 50,
    };

    return await request(app.getHttpServer())
      .post('/api/result')
      .send(result)
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
    await prisma.cleanup();
  });
});
