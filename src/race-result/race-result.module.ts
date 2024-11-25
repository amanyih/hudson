import { Module } from '@nestjs/common';
import { RaceResultService } from './race-result.service';

@Module({
  providers: [RaceResultService],
  exports: [RaceResultService],
})
export class RaceResultModule {}
