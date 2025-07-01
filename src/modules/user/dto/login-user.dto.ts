import { IsOptional, IsString } from 'class-validator';

export class LoginUserDto {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  password: string;
}
