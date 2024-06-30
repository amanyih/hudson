import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfig, AuthConfig, EnvConfig } from './shared/configuration';
import { validate } from './shared/env.validate';
import { ResultModule } from './result/result.module';
import { UserDataModule } from './user-data/user-data.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
