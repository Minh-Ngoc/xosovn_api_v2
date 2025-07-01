import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePageDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  header?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  meta_dt_title?: string;

  @IsOptional()
  @IsString()
  meta_dt_desc?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  meta_dt_keywords?: string[];
}
