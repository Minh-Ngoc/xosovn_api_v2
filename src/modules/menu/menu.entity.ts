import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Menu {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: Menu.name, default: null })
  parent: Types.ObjectId | null;

  @Prop({ default: '' })
  rank: string;

  @Prop({ default: '' })
  path: string; // optional: dùng để tìm menu theo cấp
}

export type MenuDocument = HydratedDocument<Menu>;
export const MenuSchema = SchemaFactory.createForClass(Menu);
