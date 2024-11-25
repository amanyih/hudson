import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfig, AuthConfig, EnvConfig } from './shared/configuration';
import { validate } from './shared/env.validate';
import { ResultModule } from './result/result.module';
import { UserDataModule } from './user-data/user-data.module';
import { BadgeModule } from './badge/badge.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { RaceModule } from './race/race.module';
import { RaceResultModule } from './race-result/race-result.module';
import { RequestLoggerMiddleware } from './middleware/request.logger.middleware';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DatabaseConfig, AuthConfig, EnvConfig],
      validate,
    }),
    ResultModule,
    UserDataModule,
    BadgeModule,
    ConfigModule,
    ConfigurationModule,
    RaceModule,
    RaceResultModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
