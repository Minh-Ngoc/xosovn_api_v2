import {
  Prop,
  Schema as SchemaMongoose,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Post } from '../post/post.entity';
import { Page } from '../page/page.entity';
import { User } from '../user/user.entity';

@SchemaMongoose({ timestamps: true })
export class Schema {
  @Prop({ type: String })
  schema_name: string;

  @Prop({ type: String })
  schema_script: string;

  @Prop({ type: Types.ObjectId, ref: Post.name })
  post_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Page.name })
  page_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  createdBy: Types.ObjectId;
}

export type SchemaDocument = HydratedDocument<Schema>;
export const SchemaSchema = SchemaFactory.createForClass(Schema);
