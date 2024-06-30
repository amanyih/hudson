import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateUserDataDto {
  @IsNumber()
  personalBest: number;

  @IsNumber()
  @Min(0)
  completedTests: number;

  @IsNumber()
  @Min(0)
  timeSpent: number;

  @IsNumber()
  @Min(0)
  xp: number;

  @IsString()
  bio: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsBoolean()
  isPremium: boolean;
}
