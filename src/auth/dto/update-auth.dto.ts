import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-auth.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
