import { Module } from '@nestjs/common';
import { RaceController } from './race.controller';
import { RaceService } from './race.service';
import { RaceGateway } from './race.gateway';
import { RaceResultModule } from '../race-result/race-result.module';

@Module({
  imports: [RaceResultModule],
  controllers: [RaceController],
  providers: [RaceService, RaceGateway],
})
export class RaceModule {}
