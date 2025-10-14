import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';

@Injectable()
export class BusinessesGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    //leemos el header
    const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Missing authorization header');
    }
    //Eextraemos el token
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Inavlid Authorization header format');
    }

    //validamos el token
    try{
        const secret =process.env.SUPABASE_JWT_SECRET;
        let payload:any;

        if(secret){
            //verifica firma y expiracion del token
            payload=jwt.verify(token,secret)as any;
        }else{
            payload=jwt.decode(token) as any;

            if(!payload){
                throw new UnauthorizedException('Invalid token');

            }

            request.user={
                id: payload.sub || payload.user_id || payload?.user_metadata?.sub,
        email: payload.email || payload.user_email || payload?.user_metadata?.email,
        role: payload.user_metadata?.role || payload.role || 'cliente',
            }
        };
        
        return true;
    }catch(err:any){
    throw new UnauthorizedException('Invalid token');
  }
    
  }
}
