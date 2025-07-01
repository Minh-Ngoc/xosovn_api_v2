import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSchemaDto {
  @IsNotEmpty()
  @IsString()
  schema_name: string;

  @IsOptional()
  @IsString()
  schema_script?: string;

  @IsNotEmpty()
  @IsString()
  post_id: string;

  @IsOptional()
  @IsString()
  page_id?: string;
}
