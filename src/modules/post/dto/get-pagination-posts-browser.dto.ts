import { GetPaginationDto } from '@/common/get-pagination';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class GetPaginationPostsBrowserDto extends GetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  tax_slug?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageIndex?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageSize?: number = 20;
}
