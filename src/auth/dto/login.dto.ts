
import { PickType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto extends PickType(CreateAuthDto, ['username', 'password'] as const) {
    // Las validaciones de IsString e IsNotEmpty se mantienen automáticamente
}