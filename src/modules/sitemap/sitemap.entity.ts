import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../user/user.entity';

@Schema({ timestamps: true })
export class Sitemap {
  @Prop({ type: String })
  loc: string;

  @Prop({ type: Number })
  priority: number;

  @Prop({ type: Types.ObjectId, ref: User.name })
  createdBy: Types.ObjectId;
}

export type SitemapDocument = HydratedDocument<Sitemap>;
export const SitemapSchema = SchemaFactory.createForClass(Sitemap);
