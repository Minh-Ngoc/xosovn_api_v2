import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Power655 {
  @Prop({ type: String })
  dayPrize: string;

  @Prop({ type: String })
  dayPrizeNext: string;

  @Prop({ type: String })
  number1: string;

  @Prop({ type: String })
  number2: string;

  @Prop({ type: String })
  number3: string;

  @Prop({ type: String })
  number4: string;

  @Prop({ type: String })
  number5: string;

  @Prop({ type: String })
  number6: string;

  @Prop({ type: String })
  number7: string;

  @Prop({ type: String })
  jackpot1: string;

  @Prop({ type: String })
  jackpot2: string;

  @Prop({ type: String })
  match3: string;

  @Prop({ type: String })
  match4: string;

  @Prop({ type: String })
  match5: string;

  @Prop({ type: String })
  jackpotWinner: string;

  @Prop({ type: String })
  jackpot2Winner: string;

  @Prop({ type: String })
  match3Winner: string;

  @Prop({ type: String })
  match4Winner: string;

  @Prop({ type: String })
  match5Winner: string;

  @Prop({ type: String })
  idKy: string;
}

export type Power655Document = HydratedDocument<Power655>;
export const Power655Schema = SchemaFactory.createForClass(Power655);
