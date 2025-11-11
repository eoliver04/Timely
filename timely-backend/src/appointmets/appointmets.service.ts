import { BadRequestException, Injectable } from '@nestjs/common';
import { createSupabaseClientForToken, supabase } from 'src/config/supabase.cliente';

@Injectable()
export class AppointmetsService {
    //crear appointment

    async createAppointment(scheduleid: string, authHeader: string, clientID: string) {
        console.log('[CREATE APPOINTMENT] Schedule ID:', scheduleid);
        console.log('[CREATE APPOINTMENT] Client ID:', clientID);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new BadRequestException('Invalid authorization header');
        }

        const token = authHeader.split(' ')[1];
        const sb = createSupabaseClientForToken(token);

        // 1. Verificar que el horario existe y está disponible
        const { data: schedule, error: scheduleError } = await sb
            .from('Schedules')
            .select('*')
            .eq('id', scheduleid)
            .single();

        if (scheduleError || !schedule) {
            console.error('[CREATE APPOINTMENT] Schedule not found:', scheduleError);
            throw new BadRequestException('Schedule not found');
        }

        if (!schedule.status) {
            console.error('[CREATE APPOINTMENT] Schedule not available');
            throw new BadRequestException('Schedule is not available');
        }

        // 2. Crear el appointment
        const { data, error } = await sb
            .from('Appointments')
            .insert({
                schedule_id: scheduleid,
                user_id: clientID
            })
            .select()
            .single();

        if (error) {
            console.error('[CREATE APPOINTMENT] Error:', error);
            throw new BadRequestException(error.message);
        }

        // 3. Marcar el horario como no disponible
        const { error: updateError } = await sb
            .from('Schedules')
            .update({ available: false })
            .eq('id', scheduleid);

        if (updateError) {
            console.error('[CREATE APPOINTMENT] Error updating schedule:', updateError);
            // Rollback: eliminar el appointment creado
            await sb.from('Appointments').delete().eq('id', data.id);
            throw new BadRequestException('Failed to update schedule availability');
        }

        console.log('[CREATE APPOINTMENT] Success:', data);

        return {
            message: 'Appointment created successfully',
            appointment: data
        };
    } 

    
}
