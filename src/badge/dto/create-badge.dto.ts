import { IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { BADGETYPE } from '../../shared/types/types.config';

export class CreateBadgeDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  icon: string;

  @IsNumber()
  @Min(0)
  xp: number;

  @IsEnum(BADGETYPE)
  type: BADGETYPE;
}
