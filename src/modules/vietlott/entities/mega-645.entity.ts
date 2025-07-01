import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Mega645 {
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
  jackpot: string;

  @Prop({ type: String })
  match3: string;

  @Prop({ type: String })
  match4: string;

  @Prop({ type: String })
  match5: string;

  @Prop({ type: String })
  jackpotWinner: string;

  @Prop({ type: String })
  match3Winner: string;

  @Prop({ type: String })
  match4Winner: string;

  @Prop({ type: String })
  match5Winner: string;

  @Prop({ type: String })
  idKy: string;
}

export type Mega645Document = HydratedDocument<Mega645>;
export const Mega645Schema = SchemaFactory.createForClass(Mega645);
