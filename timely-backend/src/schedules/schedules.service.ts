import { BadRequestException, Injectable } from '@nestjs/common';
import {
  createSupabaseClientForToken,
  supabase,
} from 'src/config/supabase.cliente';
import { ShedulesData, UpdateSchedules } from './dto/schedules.dto';
@Injectable()
export class SchedulesService {
  //crear un nuevo horario
  async createSchedule(
    scheduleContent: ShedulesData,
    bussinesID: string,
    authHeader: string,
  ) {
    const token = authHeader.split(' ')[1];
    const sb = createSupabaseClientForToken(token);
    const { data, error } = await sb
      .from('Schedules')
      .insert({
        business_id: bussinesID,
        date: scheduleContent.date,
        start_time: scheduleContent.start_time,
        end_time: scheduleContent.end_time,
        available: scheduleContent.available,
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  //obtener los horarios de un negocio para un dia
  async getSchedule(bussinesId:string, date?:string) {
    const { data, error } = await supabase
      .from('Schedules')
      .select('*')
      .eq('business_id', bussinesId)
      .eq('date', date);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  //update horarios
  async updateSchedules(
    scheduleId:string,
    updateData: UpdateSchedules,
    authHeader?: string,
  ) {
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid token');
    }
    const token = authHeader.split(' ')[1];
    const sb=createSupabaseClientForToken(token);
    const { data, error } = await sb
      .from('Schedules')
      .update(updateData)
      .eq('id', scheduleId)
      .select('*')
      .single();
    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  //eliminar horario
  async deleteSchedules(schedule_id: string, authHeader: string) {
    const token = authHeader.split(' ')[1];
    const sb = createSupabaseClientForToken(token);
    const { data, error } = await sb
      .from('Schedules')
      .delete()
      .eq('id', schedule_id);
    if (error) {
      throw new Error(error.message);
    }
  }
}
