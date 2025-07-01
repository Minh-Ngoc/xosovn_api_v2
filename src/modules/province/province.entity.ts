import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Province {
  @Prop({ type: Number, required: true })
  _id: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  region: number;

  @Prop({ type: String, required: true })
  nameNoSign: string;
}

export type ProvinceDocument = HydratedDocument<Province>;
export const ProvinceSchema = SchemaFactory.createForClass(Province);
