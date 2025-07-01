import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum PrizeId {
  DAC_BIET = 1,
  GIAI_1 = 2,
  GIAI_2 = 3,
  GIAI_3 = 4,
  GIAI_4 = 5,
  GIAI_5 = 6,
  GIAI_6 = 7,
  GIAI_7 = 8,
  GIAI_8 = 9,
  KHUYEN_KHICH = 10,
  PHU_DAC_BIET = 11,
}

@Schema({
  toJSON: { virtuals: true },
  timestamps: true,
})
export class Kqxs {
  @Prop({ type: Number })
  provinceId: number;

  @Prop({ type: String })
  code: string;

  @Prop({ type: Number })
  region: number;

  @Prop({ type: String })
  firstDigit: string;

  @Prop({ type: String })
  secondDigit: string;

  @Prop({ type: String })
  thirdDigit: string;

  @Prop({ type: String })
  fourthDigit: string;

  @Prop({ type: String })
  fifthDigit: string;

  @Prop({ type: String })
  sixthDigit: string;

  @Prop({ type: String })
  number: string;

  @Prop({ type: String })
  loto: string;

  @Prop({ type: String })
  lotoMixed: string;

  @Prop({ type: String })
  firstNumber: string;

  @Prop({ type: String })
  lastNumber: string;

  @Prop({ type: String })
  dayPrize: string;

  @Prop({ type: Number })
  prizeId: number;

  @Prop({ type: Number })
  prId: number;

  @Prop({ type: Number })
  prizeColumn: number;

  @Prop({ type: String })
  provinceName: string;

  @Prop({ type: Number })
  provinceRegion: number;

  @Prop({ type: String })
  provinceNameNoSign: string;

  @Prop({ type: String })
  winningName: string;

  @Prop({ type: String })
  winningMoney: string;

  @Prop({ type: String, default: false })
  isRunning: string;
}

export type KqxsDocument = HydratedDocument<Kqxs>;
export const KqxsSchema = SchemaFactory.createForClass(Kqxs);

// Optional: add virtual 'id' like in the original
KqxsSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
