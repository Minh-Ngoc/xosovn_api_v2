import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateSoMoDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  numbers: string[];

  @IsNotEmpty()
  @IsString()
  post: string;
}
