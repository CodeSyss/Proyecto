import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Cart', required: true })
  cart: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  numOrder: string;

  @Prop({ type: String, default: 'pending' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
