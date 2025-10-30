import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class SchedulesValidatorGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        //obtencion del token

        const authHeader = request.headers['authorization'];

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or invalid authorization token');
        }

        const token = authHeader.split(' ')[1];

        //validacion

        try{
            const secret=process.env.SUPABASE_JWT_SECRET;

            if(!secret){
                throw new UnauthorizedException('Missing JWT secret');
            }

            //verificar firma 

            const decode= jwt.verify(token, secret) as any;

            //asingnar usario a req para uso posterior

            request.user= decode;

            return true;
        }catch(error){
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}