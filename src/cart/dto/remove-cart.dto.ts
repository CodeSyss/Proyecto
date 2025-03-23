import { IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class RemoveFromCartDto {
  @IsNotEmpty()
  @IsMongoId()
  productId: Types.ObjectId;
}