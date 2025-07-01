import { IsOptional, IsString, Matches } from 'class-validator';

export class GetStatisticDto {
  @IsString()
  lastDate: string;

  @IsOptional()
  @Matches(/^[0-9]+$/, { message: 'numberOfDate must be a number' })
  numberOfDate?: string;

  @IsOptional()
  @IsString()
  coupleOfNumber?: string;

  @IsOptional()
  @IsString()
  option?: string;
}
