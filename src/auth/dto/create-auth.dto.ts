import { IsNumber, IsString } from 'class-validator';
export class CreateAuthDto {
    @IsString()
    name: string;
    @IsString()
    lastname: string;
    @IsNumber()
    age: number;
}
