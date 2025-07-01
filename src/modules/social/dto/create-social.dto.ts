import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSocialDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  link: string;

  @IsOptional()
  @Transform(({ value }) => [true, 'true'].includes(value))
  @IsBoolean()
  isOpen: boolean;
}
