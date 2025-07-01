import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from '../role/role.entity';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  status: string;

  @Prop({ type: Types.ObjectId, ref: Role.name })
  role: Types.ObjectId;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
