import { Injectable,CanActivate,ExecutionContext,UnauthorizedException } from "@nestjs/common";
import { supabase } from "src/config/supabase.cliente";

@Injectable()
export class AuthGuard implements CanActivate{
    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();

        //leemos el header
        const authHeader=request.headers['authorization'];
        if(!authHeader){
            throw new UnauthorizedException('Missing authorization header');
        }
        //Eextraemos el token 
        const token = authHeader.split(' ')[1];
        if(!token){
            throw new UnauthorizedException('Inavlid Authorization header format');
        }


        //validamos el token
        const {data,error}=await supabase.auth.getUser(token);
        if(error || !data.user){
            throw new UnauthorizedException('Invalid or expired token');
        }
        //asignamos al reques el user
        request.user = data.user;
        return true;
    } 
}