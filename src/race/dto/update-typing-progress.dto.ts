import { IsNumber, IsString } from 'class-validator';

export class UpdateTypingProgress {
  @IsString()
  raceId: string;
  @IsNumber()
  wordIndex: number;
  @IsNumber()
  charIndex: number;

  @IsString()
  userId: string;
}
