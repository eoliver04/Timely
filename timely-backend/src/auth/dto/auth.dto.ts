import { IsEmail, IsIn, IsOptional, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class AuthDto{
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsPhoneNumber()
    phone: string;

    @IsString()
    @MinLength(6,{message:'Password is too short'})
    password: string;

    
    @IsIn(['admin','cliente'])
    role?:'admin'|'cliente';

    

}
