import { Module } from '@nestjs/common';
import { RecommenderService } from './recommender.service';
import { RecommenderController } from './recommender.controller';
import { Neo4jModule } from 'src/database/neo4j/neo4j.module';
import { OrdersModule } from 'src/orders/orders.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/orders/schemas/order.schema';

@Module({
  imports: [
    Neo4jModule, 
    OrdersModule, 
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])
  ],
  controllers: [RecommenderController],
  providers: [RecommenderService],
})
export class RecommenderModule {}
