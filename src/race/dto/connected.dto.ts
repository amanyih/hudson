import { IsString } from 'class-validator';

export class ConnectedDto {
  @IsString()
  userId: string;
}
