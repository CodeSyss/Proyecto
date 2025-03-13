import { IsNumber, IsString } from 'class-validator';
export class CreateCustomerDto {
    @IsString()
    name: string;
    @IsString()
    lastname: string;
    @IsNumber()
    age: number;
}
