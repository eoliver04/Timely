import { Injectable,CanActivate,ExecutionContext,UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AdminAccessGuard implements CanActivate{
    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        const adminId = request.params.adminId;
        
        // Verificamos que el usuario esté en el request (debe ser añadido por BusinessesGuard)
        if(!request.user){
            throw new UnauthorizedException('User not found in request');
        }

        // Verificamos que el usuario sea admin
        if(request.user.role !== 'admin'){
            throw new UnauthorizedException('Only admins can access this resource');
        }

        // Verificamos que el usuario esté accediendo a sus propios negocios
        if(request.user.id !== adminId){
            throw new UnauthorizedException('You can only access your own businesses');
        }
        
        return true;
    } 
}