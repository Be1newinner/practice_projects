import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ROLES } from './auth.interfaces';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ROLES, default: ROLES.ADMIN })
  role: ROLES;
}

export const UserSchema = SchemaFactory.createForClass(User);
