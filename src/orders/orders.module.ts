import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { authModule } from '../auth/auth.module';
import { Order, OrderSchema } from './schemas/order.schema';


@Module({
  imports: [
      MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]), 
      authModule
    ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
