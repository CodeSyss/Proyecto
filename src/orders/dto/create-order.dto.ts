import { IsNotEmpty, IsMongoId, IsNumber, Min } from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrderDto {
    @IsNotEmpty()
    @IsNumber()
    numOrder: number;

    @IsNotEmpty()
    @IsMongoId()
    productId: Types.ObjectId;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    totalAmount: number;
}
