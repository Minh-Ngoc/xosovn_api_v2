import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PostStatusEnum } from '../post.entity';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  post_title: string;

  @IsOptional()
  @IsString()
  post_type?: string;

  @IsNotEmpty()
  @IsString()
  post_taxid: string;

  @IsOptional()
  @IsArray()
  post_tags?: string[];

  @IsOptional()
  @IsArray()
  focus_keyword?: string[];

  @IsOptional()
  @IsEnum(PostStatusEnum)
  post_status?: PostStatusEnum;

  @IsOptional()
  @IsString()
  post_image?: string;

  @IsOptional()
  post_content?: any;

  @IsOptional()
  @IsString()
  post_slug?: string;

  @IsOptional()
  post_description?: any;

  // @IsOptional()
  // schema_id?: string[];
}
