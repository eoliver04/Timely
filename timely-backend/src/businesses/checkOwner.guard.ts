import { Injectable,CanActivate,ExecutionContext,UnauthorizedException } from "@nestjs/common";
import { supabase } from "src/config/supabase.cliente";

@Injectable()
export class AdminBusinessGuard implements CanActivate{
    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        const bussinessId=request.params.id;

        if(!bussinessId){
            throw new UnauthorizedException('Missing business ID');
        }
        
        // Verificamos que el usuario esté en el request (debe ser añadido por BusinessesGuard)
        if(!request.user){
            throw new UnauthorizedException('User not found in request');
        }

        // Verificamos que el usuario sea admin
        if(request.user.role !== 'admin'){
            throw new UnauthorizedException('Only admins can access this resource');
        }

        //compruebo si el negocio es del usuario
        const {data:businessData,error:businessError}=await supabase
            .from('Businesses')
            .select('id,owner_id')
            .eq('id', bussinessId)
            .single()
        if(businessError || !businessData){
            throw new UnauthorizedException('Business not found');
        }

        // Verificamos que el usuario sea dueño del negocio
        if(businessData.owner_id !== request.user.id){
            throw new UnauthorizedException('User does not own this business');
        }
        
        return true;
        
    } 
}