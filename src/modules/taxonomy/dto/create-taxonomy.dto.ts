import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaxTypeEnum } from '../taxonomy.entity';

export class CreateTaxonomyDto {
  @IsNotEmpty()
  @IsString()
  tax_name: string;

  @IsOptional()
  @IsEnum(TaxTypeEnum)
  tax_type?: TaxTypeEnum;

  @IsNotEmpty()
  @IsString()
  tax_slug: string;

  @IsOptional()
  @IsString()
  tax_description?: string;
}
