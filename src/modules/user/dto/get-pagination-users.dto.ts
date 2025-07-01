import { GetPaginationDto } from '@/common/get-pagination';

export class GetPaginationUsers extends GetPaginationDto {
  search?: string;
}
