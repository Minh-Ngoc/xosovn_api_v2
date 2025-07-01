import { IsOptional, IsString, IsIn, IsNumberString } from 'class-validator';

export class GetResultFormGanDto {
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
  number?: string;

  @IsOptional()
  @IsIn(['headTail', 'special'])
  searchType?: 'headTail' | 'special';
}
