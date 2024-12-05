import { MODE, SUBMODE, THEME } from '../../shared/types/types.config';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateConfigurationDto {
  @IsEnum(THEME)
  @IsNotEmpty()
  theme: THEME = THEME.SYSTEM;

  @IsEnum(SUBMODE)
  words: SUBMODE = SUBMODE.TWENTY_FIVE;

  @IsEnum(SUBMODE)
  time: SUBMODE = SUBMODE.FIFTEEN_SECONDS;

  @IsEnum(MODE)
  @IsNotEmpty()
  mode: MODE = MODE.TIME;
}
