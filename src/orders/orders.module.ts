import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { authModule } from '../auth/auth.module';
import { CartModule } from '../cart/cart.module';
import { Order, OrderSchema } from './schemas/order.schema';
import { ProductsModule } from '../products/products.module'


@Module({
  imports: [
      MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]), 
      authModule,
      CartModule,
      ProductsModule
    ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
