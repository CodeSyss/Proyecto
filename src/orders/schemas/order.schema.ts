import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {

  @Prop({ type: Number, required: true })
  numOrder: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop([
    {
      product: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
      _id: false
    },
  ])
  items: {
    product: Types.ObjectId;
    quantity: number;
  }[];

  @Prop({ type: Number, required: true })
  totalAmount: number; 
}

export const OrderSchema = SchemaFactory.createForClass(Order);
