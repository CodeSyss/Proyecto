import { IsNotEmpty, IsMongoId, IsNumber, Min } from 'class-validator';

export class UpdateCartDto {
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}
