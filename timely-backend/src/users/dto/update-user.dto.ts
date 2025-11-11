import {  IsOptional, IsString, IsIn } from "class-validator";


export class UpdateUserDto{
    
    @IsOptional()
    @IsString()
    name?:string;

    @IsOptional()
    @IsString()
    phone?:string;

    @IsOptional()
    @IsString()
    @IsIn(['admin', 'cliente'])
    role?:string;

}