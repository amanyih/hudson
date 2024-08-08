import { MODE, THEME } from '../../shared/types/types.config';
import { IsNumber, IsString, Min, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateConfigurationDto {
  @IsEnum(THEME)
  @IsNotEmpty()
  theme: THEME;

  @IsNumber()
  @Min(0)
  words: number;

  @IsNumber()
  @Min(0)
  time: number;

  @IsEnum(MODE)
  @IsNotEmpty()
  mode: MODE;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
