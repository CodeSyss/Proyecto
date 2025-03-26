import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart, CartSchema } from './schemas/cart.schema';
import { authModule } from '../auth/auth.module';
import { Neo4jModule } from 'src/database/neo4j/neo4j.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]), 
    authModule,
    Neo4jModule
  ],
  exports: [MongooseModule],
  controllers: [CartController],
  providers: [CartService], 
})
export class CartModule {}
