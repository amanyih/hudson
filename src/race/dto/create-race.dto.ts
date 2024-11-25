import { SUBMODE } from '../../shared/types/types.config';
import {
  IsBoolean,
  IsString,
  IsArray,
  IsOptional,
  IsEnum,
  IsDate,
} from 'class-validator';

export class CreateRaceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(SUBMODE)
  subMode: SUBMODE;

  @IsDate()
  startTime: Date;

  @IsString()
  language: string;

  @IsBoolean()
  hasNumbers: boolean;

  @IsBoolean()
  hasPunctuation: boolean;

  @IsBoolean()
  isPublic: boolean;

  @IsArray()
  invitedUsers: string[];
}
