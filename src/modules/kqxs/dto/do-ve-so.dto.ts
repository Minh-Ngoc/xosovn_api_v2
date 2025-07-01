import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class DoVeSoDto {
  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  number: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  province: number;
}
