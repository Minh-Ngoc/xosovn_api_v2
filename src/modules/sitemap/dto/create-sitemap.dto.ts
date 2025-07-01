import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSitemapDto {
  @IsNotEmpty()
  @IsString()
  loc: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  priority: string;
}
