import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Max3D {
  @Prop({ type: String })
  dayPrize: string;

  @Prop({ type: String })
  dayPrizeNext: string;

  @Prop({ type: String })
  firstPrize1: string;

  @Prop({ type: String })
  firstPrize2: string;

  @Prop({ type: String })
  secondPrize1: string;

  @Prop({ type: String })
  secondPrize2: string;

  @Prop({ type: String })
  secondPrize3: string;

  @Prop({ type: String })
  secondPrize4: string;

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
  resultsConsolation1: string;

  @Prop({ type: String })
  resultsConsolation2: string;

  @Prop({ type: String })
  resultsConsolation3: string;

  @Prop({ type: String })
  resultsConsolation4: string;

  @Prop({ type: String })
  resultsConsolation5: string;

  @Prop({ type: String })
  resultsConsolation6: string;

  @Prop({ type: String })
  resultsConsolation7: string;

  @Prop({ type: String })
  resultsConsolation8: string;

  @Prop({ type: String })
  firstTotalWinners: string;

  @Prop({ type: String })
  secondTotalWinners: string;

  @Prop({ type: String })
  thirdTotalWinners: string;

  @Prop({ type: String })
  consolationTotalWinners: string;

  @Prop({ type: String })
  win1StAmount: string;

  @Prop({ type: String })
  win2StAmount: string;

  @Prop({ type: String })
  win3StAmount: string;

  @Prop({ type: String })
  winConsolationAmount: string;

  @Prop({ type: String })
  idKy: string;
}

export type Max3DDocument = HydratedDocument<Max3D>;
export const Max3DSchema = SchemaFactory.createForClass(Max3D);
