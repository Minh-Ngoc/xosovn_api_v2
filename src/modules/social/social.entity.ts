import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Social {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  link: string;

  @Prop({ type: Boolean, default: true })
  isOpen: boolean;

  @Prop({ type: String })
  icon: string;
}

export type SocialDocument = HydratedDocument<Social>;
export const SocialSchema = SchemaFactory.createForClass(Social);
