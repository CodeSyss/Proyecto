import { Module } from '@nestjs/common';
import { authService } from './auth.service';
import { authController } from './auth.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions:{expiresIn: '600s'},
    }),

  ],
  exports: [MongooseModule],
  controllers: [authController],
  providers: [authService, JwtStrategy],
})
export class authModule {}
