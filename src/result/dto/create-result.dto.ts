import {
  IsNumber,
  IsString,
  IsBoolean,
  IsArray,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { MODE, SUBMODE } from '../../shared/types/types.config';

export class CreateResultDto {
  @IsNumber()
  @Min(0)
  wpm: number;

  @IsNumber()
  @Min(0)
  rawWpm: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  accuracy: number;

  @IsNumber()
  @Min(0)
  charactersTotal: number;

  @IsEnum(MODE)
  mode: MODE;

  @IsEnum(SUBMODE)
  submode: SUBMODE;

  @IsBoolean()
  punctuation: boolean;

  @IsBoolean()
  numbers: boolean;

  @IsBoolean()
  testLanguage: string;

  @IsArray()
  @IsNumber({}, { each: true })
  keySpacing: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  keyDuration: number[];

  @IsNumber()
  @Min(0)
  duration: number;

  @IsString()
  userId: string;
}
