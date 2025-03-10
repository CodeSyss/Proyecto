import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  lastname: string;
  @Prop({ required: true })
  age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
