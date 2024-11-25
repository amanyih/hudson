import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateRaceResultDto {
  @IsString()
  raceId: string;
  @IsString()
  userId: string;
  @IsNumber()
  wordsTyped: number;
  @IsNumber()
  completionTime: number;
  @IsNumber()
  accuracy: number;
  @IsNumber()
  rank: number;
  @IsBoolean()
  isWinner: boolean;
}
