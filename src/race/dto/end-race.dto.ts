import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class ParticipantResultDto {
  @IsUUID()
  @IsNotEmpty()
  raceId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsNumber()
  completionTime?: number;

  @IsNotEmpty()
  @IsNumber()
  wordsTyped: number;

  @IsOptional()
  @IsNumber()
  accuracy?: number;
}

export class EndRaceDto {
  @IsUUID()
  raceId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantResultDto)
  participants: ParticipantResultDto[];
}
