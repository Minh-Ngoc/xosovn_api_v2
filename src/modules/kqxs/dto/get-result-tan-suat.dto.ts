import { IsOptional, IsInt, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetResultTanSuatDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  number?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  region?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  province?: number;

  @IsOptional()
  @IsIn(['special'])
  searchType?: string;

  @IsOptional()
  @IsIn(['region', 'province'])
  sortBy?: string;
}
