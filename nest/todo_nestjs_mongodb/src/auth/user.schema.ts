import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

enum ROLES {
  'USER' = 'user',
  'ADMIN' = 'admin',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: ROLES.ADMIN })
  role: ROLES;
}

export const UserSchema = SchemaFactory.createForClass(User);
