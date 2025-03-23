import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema() 
export class Product extends Document {
  @Prop({ required: true }) 
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;
}

export const Productschema = SchemaFactory.createForClass(Product);