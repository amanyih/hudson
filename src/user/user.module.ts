import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigurationModule } from '../configuration/configuration.module';
import { UserDataModule } from '../user-data/user-data.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [ConfigurationModule, UserDataModule],
})
export class UserModule {}
