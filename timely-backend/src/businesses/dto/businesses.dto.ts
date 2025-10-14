import { IsOptional, IsString } from "class-validator";

 
export class CreateBusinessDTO {
    @IsString()
    name?:string;

    @IsString()
    adress?:string;

    @IsOptional()
    @IsString()
    info?:string;

    @IsOptional()
    @IsString()
    phone?:string;

}

export class UpdateBusinessDTO{
    @IsOptional()
    @IsString()
    name?:string;

    @IsOptional()
    @IsString()
    phone?:string;

    @IsOptional()
    @IsString()
    address?:string;

    @IsOptional()
    @IsString()
    info?:string;

   

}