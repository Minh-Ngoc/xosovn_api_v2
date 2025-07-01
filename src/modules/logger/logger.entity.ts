import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User, UserDocument } from '../user/user.entity';
import { ActionLogEnum, SubjectEnum } from '@/enums';

@Schema({ timestamps: true })
export class Logger {
  @Prop({ type: String, required: true })
  actionName: string;

  @Prop({ type: String, enum: ActionLogEnum, required: true })
  action: string;

  @Prop({ type: String, enum: SubjectEnum, required: true })
  subject: string;

  @Prop({ type: Types.ObjectId, ref: User.name, isRequired: true })
  user: UserDocument;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: String, required: true })
  endPoint: string;

  @Prop({ type: String, required: true })
  method: string;

  @Prop({ type: String, default: '' })
  body: string;

  @Prop({ type: String, default: '' })
  oldData: string;

  @Prop({ type: String, default: '' })
  newData: string;

  @Prop({ type: String, default: '' })
  message: string;

  @Prop({ type: String, default: '' })
  userAgent: string;

  @Prop({ type: String, default: '' })
  referer: string;
}

export type LoggerDocument = HydratedDocument<Logger>;
export const LoggerSchema = SchemaFactory.createForClass(Logger);
