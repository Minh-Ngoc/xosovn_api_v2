import { IsNotEmpty, IsString } from 'class-validator';

export class GetVietlottByDate {
  @IsNotEmpty()
  @IsString()
  ngay: string;
}
