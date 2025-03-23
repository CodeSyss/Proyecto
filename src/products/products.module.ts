import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';


import { Product, Productschema } from './schemas/product.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
      MongooseModule.forFeature([
        {
          name: Product.name,
          schema: Productschema,
        },
      ]),
    ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
