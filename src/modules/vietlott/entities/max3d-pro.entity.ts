import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Max3DPro {
  @Prop({ type: String })
  dayPrize: string;

  @Prop({ type: String })
  dayPrizeNext: string;

  @Prop({ type: String })
  specialPrize1: string;

  @Prop({ type: String })
  specialPrize2: string;

  @Prop({ type: String })
  subSpecialPrize1: string;

  @Prop({ type: String })
  subSpecialPrize2: string;

  @Prop({ type: String })
  firstPrize1: string;

  @Prop({ type: String })
  firstPrize2: string;

  @Prop({ type: String })
  firstPrize3: string;

  @Prop({ type: String })
  firstPrize4: string;

  @Prop({ type: String })
  secondPrize1: string;

  @Prop({ type: String })
  secondPrize2: string;

  @Prop({ type: String })
  secondPrize3: string;

  @Prop({ type: String })
  secondPrize4: string;

  @Prop({ type: String })
  secondPrize5: string;

  @Prop({ type: String })
  secondPrize6: string;

  @Prop({ type: String })
  thirdPrize1: string;

  @Prop({ type: String })
  thirdPrize2: string;

  @Prop({ type: String })
  thirdPrize3: string;

  @Prop({ type: String })
  thirdPrize4: string;

  @Prop({ type: String })
  thirdPrize5: string;

  @Prop({ type: String })
  thirdPrize6: string;

  @Prop({ type: String })
  thirdPrize7: string;

  @Prop({ type: String })
  thirdPrize8: string;

  @Prop({ type: String })
  specialPrizeWinners: string;

  @Prop({ type: String })
  subSpecialPrizeWinners: string;

  @Prop({ type: String })
  firstPrizeWinners: string;

  @Prop({ type: String })
  secondPrizeWinners: string;

  @Prop({ type: String })
  thirdPrizeWinners: string;

  @Prop({ type: String })
  fourthPrizeWinners: string;

  @Prop({ type: String })
  fifthPrizeWinners: string;

  @Prop({ type: String })
  sixthPrizeWinners: string;

  @Prop({ type: String })
  idKy: string;
}

export type Max3DProDocument = HydratedDocument<Max3DPro>;
export const Max3DProSchema = SchemaFactory.createForClass(Max3DPro);
