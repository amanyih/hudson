import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  page: number = 0;

  @IsNumber()
  @IsOptional()
  @Min(1)
  limit: number = 10;
}
