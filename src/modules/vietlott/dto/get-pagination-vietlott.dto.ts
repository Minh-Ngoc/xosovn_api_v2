import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetPaginationVietlottDto {
  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit: number;
}
