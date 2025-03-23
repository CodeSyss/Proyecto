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

    @Prop({ required: true, unique: true })
    email: string;  

    @Prop({ required: true, unique: true })
    phone: string;  

    @Prop()
    address?: string;

    @Prop()
    country?: string;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: [{ type: 'ObjectId', ref: 'Order' }] })  // Las ordenes están referenciadas.
    purchaseHistory: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
