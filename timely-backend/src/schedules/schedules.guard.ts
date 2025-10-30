import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { supabase } from "src/config/supabase.cliente";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class SchedulesOwnerGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const businessId = request.params.businessID;  

        console.log(' [SchedulesOwnerGuard] Business ID:', businessId);

        if (!businessId) {
            throw new UnauthorizedException('Missing business ID');
        }

        //  Obtener token del header
        const authHeader = request.headers['authorization'];
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing authorization token');
        }

        const token = authHeader.split(' ')[1];

        //  Validar JWT con la firma de Supabase
        let userId: string;
        let userEmail: string;
        let userRole: string;

        try {
            const secret = process.env.SUPABASE_JWT_SECRET;

            if (!secret) {
                throw new UnauthorizedException('JWT secret not configured');
            }

            // Verificar firma y decodificar token
            const decoded = jwt.verify(token, secret) as any;

            console.log(' [SchedulesOwnerGuard] Token válido, payload:', {
                sub: decoded.sub,
                email: decoded.email,
                role: decoded.user_metadata?.role,
            });

            userId = decoded.sub;
            userEmail = decoded.email;
            userRole = decoded.user_metadata?.role || 'cliente';

        } catch (error) {
            console.log(' [SchedulesOwnerGuard]  Token inválido:', error.message);
            throw new UnauthorizedException('Invalid or expired token');
        }

        //  Verificar que el usuario es admin
        if (userRole !== 'admin') {
            console.log(' [SchedulesOwnerGuard]  Usuario no es admin');
            throw new ForbiddenException('Only admins can manage schedules');
        }

        //  Verificar que el negocio pertenece al admin
        const { data: businessData, error: businessError } = await supabase
            .from('Businesses')
            .select('id, owner_id')
            .eq('id', businessId)
            .single();

        if (businessError || !businessData) {
            console.log(' [SchedulesOwnerGuard]  Negocio no encontrado');
            throw new ForbiddenException('Business not found');
        }

        if (businessData.owner_id !== userId) {
            console.log(' [SchedulesOwnerGuard]  Usuario no es dueño del negocio');
            throw new ForbiddenException('You can only manage schedules for your own businesses');
        }

        console.log('🔑 [SchedulesOwnerGuard]  Validación exitosa');
        
        return true;
    }
}
