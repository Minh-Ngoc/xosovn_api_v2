import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../user/user.entity';

export enum TaxTypeEnum {
  CATEGORY = 'category',
}

@Schema({ timestamps: true })
export class Taxonomy {
  @Prop({ type: String })
  tax_name: string;

  @Prop({ enum: TaxTypeEnum, default: TaxTypeEnum.CATEGORY })
  tax_type: string;

  @Prop({ type: String, default: '' })
  tax_slug: string;

  @Prop({ type: String })
  tax_description: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  createdBy: Types.ObjectId;
}

export type TaxonomyDocument = HydratedDocument<Taxonomy>;
export const TaxonomySchema = SchemaFactory.createForClass(Taxonomy);
