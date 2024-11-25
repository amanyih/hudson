import { IsNumber, IsString } from 'class-validator';

export class ExtendStartTimeDto {
  @IsString()
  id: string;
  @IsNumber()
  duration: number;
}
