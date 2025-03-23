import { IsNumber, IsString, IsNotEmpty, IsEmail, IsOptional, IsArray,IsMongoId } from 'class-validator';
export class CreateAuthDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsNumber()
    @IsNotEmpty()
    age: number;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    purchaseHistory?: string[];
}