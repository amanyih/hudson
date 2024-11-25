import { IsString } from 'class-validator';

export class JoinLobbyDto {
  @IsString()
  userId: string;
  @IsString()
  raceId: string;
}
