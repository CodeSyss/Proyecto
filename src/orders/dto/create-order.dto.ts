import { IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsMongoId()
  cartId: Types.ObjectId;
}
