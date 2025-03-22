import { Module } from '@nestjs/common';
import { authService } from './auth.service';
import { authController } from './auth.controller';
import { Customer, authquema } from './squemas/user.squema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Customer.name,
        schema: authquema,
      },
    ]),
  ],
  controllers: [authController],
  providers: [authService],
})
export class authModule {}
