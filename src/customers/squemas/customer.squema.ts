import  { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({timestamps: true })
export class Customer extends Document{
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    lastname: string;
    @Prop({ required: true })
    age: number;
}

export const CustomerSquema = SchemaFactory.createForClass(Customer)


