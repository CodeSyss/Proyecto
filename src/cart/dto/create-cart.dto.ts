import { IsNotEmpty, IsMongoId, IsNumber, Min } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCartDto {

    @IsNotEmpty()
    @IsMongoId()
    productId: Types.ObjectId;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number;
}

