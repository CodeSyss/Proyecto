import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Cart, CartSchema } from '../cart/schemas/cart.schema';
import { authModule } from 'src/auth/auth.module';
import { Neo4jModule } from 'src/database/neo4j/neo4j.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    authModule,
    Neo4jModule, 
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [MongooseModule],
})
export class OrdersModule {}
