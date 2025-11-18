import { Controller, Param, Post , Headers, Req, UseGuards, Get,Body, Query, Delete, Patch} from '@nestjs/common';
import { AppointmetsService } from './appointmets.service';
import { AppointmentsGuard } from './appointmets.guard';

@Controller('appointments')
export class AppointmetsController {
  constructor(private readonly appointmetsService: AppointmetsService) {}

  //crear un appointment
  @UseGuards(AppointmentsGuard)
  @Post('schedule/:scheduleId')
  async createAppointment(
    @Param('scheduleId') scheduleId: string,
    @Headers('authorization') authHeader: string,
    @Req() req: any
  ){
    return this.appointmetsService.createAppointment(scheduleId, authHeader, req.user.id); 
  }


  //obtener appointments por usuario
  @UseGuards(AppointmentsGuard)
  @Get('me')
  async getAppointmentsByUser(
    @Headers('authorization') authHeader: string,
    @Req() req: any
  ){
    return this.appointmetsService.getAppointmentsByUser(req.user.id, authHeader);
  }

  //obtener appointments por negocio
  @UseGuards(AppointmentsGuard)
  @Get('business/:businessId')
  async getAppointmentsByBusiness(
    @Param('businessId') businessId:string,
    @Headers('authorization') authHeader: string,
    @Query('date') date?:string,
  ){
    return this.appointmetsService.getAppointmentsByBusiness(businessId, authHeader, date);
  }

  //cancelar appointment cliente
  @UseGuards(AppointmentsGuard)
  @Delete(':appointmentId')
  async cancelAppointment(
    @Param('appointmentId') appointmentId: string,
    @Headers('authorization') authHeader: string,
    @Req() req: any,
  ){
    return this.appointmetsService.cancelAppointment(appointmentId, authHeader, req.user.id);
  }
  //actualizacion del estado de reserva por admin
  @UseGuards(AppointmentsGuard)
  @Patch(':appointmentId/status')
  async appointmentUpdate(
    @Param('appointmentId') appointmentId: string,
    @Body() body: { verify: boolean },
    @Headers('authorization') authHeader: string,
    @Req() req: any
  ){
    return this.appointmetsService.appointmentUpdate(appointmentId, body.verify, authHeader, req.user.id);
  }
}
