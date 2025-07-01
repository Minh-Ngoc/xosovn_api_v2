import { IsOptional, IsString } from 'class-validator';

export class MoveMenuDto {
  @IsOptional()
  @IsString()
  newParentId?: string | null;

  @IsOptional()
  @IsString()
  beforeId?: string;
}
