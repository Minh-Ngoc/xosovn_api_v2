import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../user/user.entity';

@Schema({ timestamps: true })
export class Page {
  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  content: string;

  @Prop({ type: String })
  header: string;

  @Prop({ type: String })
  meta_dt_title: string;

  @Prop({ type: String })
  meta_dt_desc: string;

  @Prop({ type: [String] })
  meta_dt_keywords: string[];

  @Prop({ type: String })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  createdBy: Types.ObjectId;
}

export type PageDocument = HydratedDocument<Page>;
export const PageSchema = SchemaFactory.createForClass(Page);
