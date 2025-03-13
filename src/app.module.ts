import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { RequestsModule } from './requests/requests.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        return {
          uri: process.env.MONGODB_URI,
          dbName: process.env.MONGODB_DB,
        };
      },
    }),
    ProductsModule,
    RequestsModule,
    CustomersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
