import { BadRequestException, Injectable } from '@nestjs/common';
import {
  createSupabaseClientForToken,
  supabase,
} from 'src/config/supabase.cliente';

@Injectable()
export class AppointmetsService {
  //crear appointment

  async createAppointment(
    scheduleid: string,
    authHeader: string,
    clientID: string,
  ) {
    console.log('[CREATE APPOINTMENT] Schedule ID:', scheduleid);
    console.log('[CREATE APPOINTMENT] Client ID:', clientID);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    const sb = createSupabaseClientForToken(token);

    // Verificar que el horario existe y está disponible
    const { data: schedule, error: scheduleError } = await sb
      .from('Schedules')
      .select('*')
      .eq('id', scheduleid)
      .single();

    if (scheduleError || !schedule) {
      console.error('[CREATE APPOINTMENT] Schedule not found:', scheduleError);
      throw new BadRequestException('Schedule not found');
    }

    if (!schedule.available) {
      console.error('[CREATE APPOINTMENT] Schedule not available');
      throw new BadRequestException('Schedule is not available');
    }

    //  Crear el appointment
    const { data, error } = await sb
      .from('Appointments')
      .insert({
        schedule_id: scheduleid,
        user_id: clientID,
        status: true,
      })
      .select()
      .single();

    if (error) {
      console.error('[CREATE APPOINTMENT] Error:', error);
      throw new BadRequestException(error.message);
    }

    //  Marcar el horario como no disponible
    const { error: updateError } = await sb
      .from('Schedules')
      .update({ available: false })
      .eq('id', scheduleid);

    if (updateError) {
      console.error(
        '[CREATE APPOINTMENT] Error updating schedule:',
        updateError,
      );
      // Rollback: eliminar el appointment creado
      await sb.from('Appointments').delete().eq('id', data.id);
      throw new BadRequestException('Failed to update schedule availability');
    }

    console.log('[CREATE APPOINTMENT] Success:', data);

    return {
      message: 'Appointment created successfully',
      appointment: data,
    };
  }

  //obtener los appointments de un usuario por id
  async getAppointmentsByUser(userId: string, authHeader: string) {
    console.log('[GET APPOINTMENTS] User ID:');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    const sb = createSupabaseClientForToken(token);

    const { data, error } = await sb
      .from('Appointments')
      .select(
        `
      *,
      schedule:Schedules (
        *,
        business:Businesses (
          id,
          name,
          address,
          phone
        )
      )
    `,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[GET APPOINTMENTS] Error:', error);
      throw new BadRequestException(error.message);
    }

    return data;
  }

  //obtener los appointments de cada negocio por dia
  async getAppointmentsByBusiness(
    businessId: string,
    authHeader: string,
    date?: string,
  ) {
    console.log('[GET APPOINTMENTS BY BUSINESS] Business ID:', businessId);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid authorization header');
    }
    const token = authHeader.split(' ')[1];
    const sb = createSupabaseClientForToken(token);

    let query = sb
      .from('Appointments')
      .select(
        `
      *,
      schedule:Schedules!inner (
        *,
        business:Businesses (
        id,
        name,
        phone
        )
      ),
      user:user_status (
        id,
        user_name,
        phone
      )
    `,
      )
      .eq('schedule.business.id', businessId);

    if (date) {
      query = query.eq('schedule.date', date);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[GET APPOINTMENTS BY BUSINESS] Error:', error);
      throw new BadRequestException(error.message);
    }
    //ordenamiento manual de los datos
    const sortedData = (data || []).sort((a, b) => {
      const dateCompare = a.schedule.date.localeCompare(b.schedule.date);
      if (dateCompare !== 0) {
        return dateCompare;
      }
      return a.schedule.start_time.localeCompare(b.schedule.start_time);
    });
    return {
      appointments: sortedData,
      total: sortedData.length,
      date: date || 'all',
      businessId: businessId,
    };
  }

  //cancelar appointment cliente

  async cancelAppointment(
    appointmentId: string,
    authHeader: string,
    userId: string,
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    const sb = createSupabaseClientForToken(token);

    //verificar que el appointment pertenece al usario

    const { data: appointment, error: getError } = await sb
      .from('Appointments')
      .select('*,schedule_id')
      .eq('id', appointmentId)
      .eq('user_id', userId)
      .single();

    if (getError || !appointment) {
      throw new BadRequestException('Appointment not found');
    }
    //eliminar el horario
    const { error: deleError } = await sb
      .from('Appointments')
      .delete()
      .eq('id', appointmentId);
    if (deleError) {
      throw new BadRequestException(deleError.message);
    }
    //marcarlo como libre
    const { error: updateError } = await sb
      .from('Schedules')
      .update({ available: true })
      .eq('id', appointment.schedule_id);

    if (updateError) {
      throw new BadRequestException('Error to update the appiontment');
    }

    return {
      message: 'Appointment cancelled successfully',
    };
  }

  //chequeo de appointment admin
  async appointmentUpdate(
    appointmentId: string,
    verify: boolean,
    authHeader: string,
    userId: string,
  ) {
    console.log('[UPDATE APPOINTMENT] Appointment ID:', appointmentId);
    console.log('[UPDATE APPOINTMENT] Verify value:', verify);
    console.log('[UPDATE APPOINTMENT] Verify type:', typeof verify);
    console.log('[UPDATE APPOINTMENT] User ID:', userId);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    const sb = createSupabaseClientForToken(token);

    const { data: appointment, error: getError } = await sb
    .from('Appointments')
    .select(`
      *,
      schedule:Schedules (
        *,
        business:Businesses (
          id,
          owner_id
        )
      )
    `)
    .eq('id',appointmentId)
    .single();

    if(getError || !appointment){
      console.error('[UPDATE APPOINTMENT] Get error:', getError);
      throw new BadRequestException('Appointment not found');
    }

    console.log('[UPDATE APPOINTMENT] Appointment found:', appointment.id);
    console.log('[UPDATE APPOINTMENT] Business owner:', appointment.schedule.business.owner_id);

    if(appointment.schedule.business.owner_id !== userId){
      console.error('[UPDATE APPOINTMENT] Unauthorized - Owner mismatch');
      throw new BadRequestException('Unauthorized');
    }

    //actualizacion de estado
    console.log('[UPDATE APPOINTMENT] Updating with:', { verified: verify });
    
    const {data,error:updateError}=await sb 
      .from('Appointments')
      .update({ verify: verify })
      .eq('id', appointmentId)
      .select()
      .single();
      
    if(updateError){
      console.error('[UPDATE APPOINTMENT] Update error:', updateError);
      console.error('[UPDATE APPOINTMENT] Update error details:', JSON.stringify(updateError));
      throw new BadRequestException(`Error updating appointment: ${updateError.message || updateError.code}`);
    }
    
    console.log('[UPDATE APPOINTMENT] Success:', data);
    
    return {
      message: 'Appointment updated successfully',
      appointment: data,
    };
  }
}
