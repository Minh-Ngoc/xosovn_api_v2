import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetPaginationKqxsDto {
  @IsNotEmpty()
  @IsString()
  date: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  province: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit: number;
}
