import { IsNumber, IsString, Min } from 'class-validator';

export class CreateUserDataDto {
  @IsString()
  displayName: string = '';

  @IsString()
  avatar: string = '';

  @IsNumber()
  personalBest: number = 0;

  @IsNumber()
  @Min(0)
  completedTests: number = 0;

  @IsNumber()
  @Min(0)
  timeSpent: number = 0;

  @IsNumber()
  @Min(0)
  xp: number = 0;

  @IsString()
  bio: string = '';
}
