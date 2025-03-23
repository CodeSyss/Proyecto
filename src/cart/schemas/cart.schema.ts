import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Cart extends Document {
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

  @Prop({ default: false })
  isCheckedOut: boolean;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
