import { Module } from '@nestjs/common';
import { UserDataService } from './user-data.service';
import { UserDataController } from './user-data.controller';

@Module({
  controllers: [UserDataController],
  providers: [UserDataService],
  exports: [UserDataService],
})
export class UserDataModule {}
