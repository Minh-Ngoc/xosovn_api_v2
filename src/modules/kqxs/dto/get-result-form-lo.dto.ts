import { IsOptional, IsString, IsIn, IsNumberString } from 'class-validator';

export class GetResultFormLoDto {
  @IsOptional()
  @IsIn(['province', 'region'])
  sortBy?: 'province' | 'region';

  @IsOptional()
  @IsNumberString()
  province?: string;

  @IsOptional()
  @IsNumberString()
  region?: string;

  @IsOptional()
  @IsString()
  startDate?: string; // Expecting format: DD-MM-YYYY

  @IsOptional()
  @IsString()
  endDate?: string; // Expecting format: DD-MM-YYYY

  @IsOptional()
  @IsNumberString()
  number?: string;
}
