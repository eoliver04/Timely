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
        verify: 'pending', // Por defecto pendiente de aprobación
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

  //cancelar appointment cliente o admin

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

    // Obtener el appointment con información del negocio
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
      .eq('id', appointmentId)
      .single();

    if (getError || !appointment) {
      throw new BadRequestException('Appointment not found');
    }

    // Verificar que sea el cliente O el dueño del negocio
    const isClient = appointment.user_id === userId;
    const isBusinessOwner = appointment.schedule.business.owner_id === userId;

    if (!isClient && !isBusinessOwner) {
      throw new BadRequestException('Unauthorized to cancel this appointment');
    }

    // Eliminar el appointment
    const { error: deleteError } = await sb
      .from('Appointments')
      .delete()
      .eq('id', appointmentId);

    if (deleteError) {
      throw new BadRequestException(deleteError.message);
    }

    // Marcar el horario como disponible
    const { error: updateError } = await sb
      .from('Schedules')
      .update({ available: true })
      .eq('id', appointment.schedule_id);

    if (updateError) {
      throw new BadRequestException('Error updating schedule availability');
    }

    return {
      message: 'Appointment cancelled successfully',
    };
  }

  //chequeo de appointment admin
  async appointmentUpdate(
    appointmentId: string,
    verify: 'approved' | 'canceled',
    authHeader: string,
    userId: string,
  ) {
    console.log('[UPDATE APPOINTMENT] Appointment ID:', appointmentId);
    console.log('[UPDATE APPOINTMENT] Verify value:', verify);
    console.log('[UPDATE APPOINTMENT] Verify type:', typeof verify);
    console.log('[UPDATE APPOINTMENT] User ID:', userId);
    
    // Validar que el valor sea válido
    if (verify !== 'approved' && verify !== 'canceled') {
      throw new BadRequestException('Invalid verify value. Must be "approved" or "canceled"');
    }
    
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
    console.log('[UPDATE APPOINTMENT] Updating with:', { verify: verify });
    
    const {data,error:updateError}=await sb 
      .from('Appointments')
      .update({ verify: verify })
      .eq('id', appointmentId)
      .select();
      
    if(updateError){
      console.error('[UPDATE APPOINTMENT] Update error:', updateError);
      console.error('[UPDATE APPOINTMENT] Update error details:', JSON.stringify(updateError));
      throw new BadRequestException(`Error updating appointment: ${updateError.message || updateError.code}`);
    }
    
    console.log('[UPDATE APPOINTMENT] Success - rows affected:', data?.length);
    console.log('[UPDATE APPOINTMENT] Updated data:', data);

    // Si se cancela, marcar el horario como disponible
    if (verify === 'canceled') {
      console.log('[UPDATE APPOINTMENT] Marking schedule as available because appointment was canceled');
      const { error: scheduleError } = await sb
        .from('Schedules')
        .update({ available: true })
        .eq('id', appointment.schedule_id);

      if (scheduleError) {
        console.error('[UPDATE APPOINTMENT] Error updating schedule:', scheduleError);
      } else {
        console.log('[UPDATE APPOINTMENT] Schedule marked as available');
      }
    }
    
    return {
      message: 'Appointment updated successfully',
      appointment: data?.[0],
    };
  }
}
