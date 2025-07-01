import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetPaginationDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  pageIndex?: number = 1;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  pageSize?: number = 10;
}
