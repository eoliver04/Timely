import { Controller, Param, Post , Headers, Req, UseGuards} from '@nestjs/common';
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
}
