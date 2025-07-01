import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetKqxsTinhDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  province: number;

  @IsNotEmpty()
  @IsString()
  date: string;
}
