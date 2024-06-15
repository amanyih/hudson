import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  page: number = 1;

  @IsNumber()
  @IsOptional()
  @Min(1)
  limit: number = 10;
}
