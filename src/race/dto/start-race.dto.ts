import { IsString } from 'class-validator';

export class StartRaceDto {
  @IsString()
  raceId: string;
}
