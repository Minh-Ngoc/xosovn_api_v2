import {
  Prop,
  Schema as SchemaMongoose,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Taxonomy } from '../taxonomy/taxonomy.entity';
import { User } from '../user/user.entity';
// import { Schema } from '../schema/schema.entity';

export enum PostStatusEnum {
  PUBLIC = 'public',
  DRAFF = 'draft',
  PENDING = 'pending',
  REJECT = 'reject',
}

@SchemaMongoose({ timestamps: true })
export class Post {
  @Prop({ type: String, default: null })
  post_type: string;

  @Prop({ type: String, required: true })
  post_title: string;

  @Prop({ type: Types.ObjectId, ref: Taxonomy.name, required: true })
  post_taxid: Types.ObjectId;

  @Prop({ type: [String] })
  post_tags: string[];

  @Prop({ type: [String] })
  focus_keyword: string[];

  @Prop({ type: Number, default: 0 })
  post_views: number;

  @Prop({ enum: PostStatusEnum, default: PostStatusEnum.DRAFF })
  post_status: PostStatusEnum;

  @Prop({ type: String })
  post_image: string;

  @Prop({ type: Object })
  post_content: any;

  @Prop({ type: String })
  post_slug: string;

  @Prop({ type: Object })
  post_description: any;

  // @Prop({ type: [Types.ObjectId], ref: Schema.name })
  // schema_id?: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: User.name })
  reviewer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  updatedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  createdBy: Types.ObjectId;
}

export type PostDocument = HydratedDocument<Post>;
export const PostSchema = SchemaFactory.createForClass(Post);
