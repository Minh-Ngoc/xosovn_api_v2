import { IsNotEmpty, IsString } from 'class-validator';

export class GetKqxsMienDto {
  @IsNotEmpty()
  @IsString()
  ngay: string;
}
