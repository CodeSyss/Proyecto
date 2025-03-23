import { Module } from '@nestjs/common';
import { authService } from './auth.service';
import { authController } from './auth.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [authController],
  providers: [authService],
})
export class authModule {}
