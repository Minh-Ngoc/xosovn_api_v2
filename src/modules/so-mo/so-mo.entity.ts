import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';

@Schema({ timestamps: true })
export class SoMo {
  @Prop({ type: String })
  title: string;

  @Prop({ type: [String] })
  numbers: string[];

  @Prop({ type: Types.ObjectId, ref: Post.name })
  post: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  createdBy: Types.ObjectId;
}

export type SoMoDocument = HydratedDocument<SoMo>;
export const SoMoSchema = SchemaFactory.createForClass(SoMo);
