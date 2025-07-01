import { GetPaginationDto } from '@/common/get-pagination';
import { IsOptional, IsString } from 'class-validator';

export class GetPaginationPostsDto extends GetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  post_taxid?: string;

  @IsOptional()
  @IsString()
  post_status?: string;
}
