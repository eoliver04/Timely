import { Controller, Param, Post, Body, UseGuards,Get, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ShedulesData } from './dto/schedules.dto';
import { SchedulesOwnerGuard } from './schedules.guard';
import { SchedulesValidatorGuard } from './validator.guard';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  //create a new schedule
  @UseGuards(SchedulesOwnerGuard)
  @Post('business/:businessID')
  async createSchedule(
    @Param('businessID') businessId: string,
    @Body() scheduleData: ShedulesData,
  ) {
    return this.schedulesService.createSchedule(scheduleData, businessId);
  }

  //obtencion de los horarios
 
  @Get('business/:businessID')
  async getSchedules(
    @Param('businessID') businessID:string,
    @Query ('date') date:string
  ){
    return this.schedulesService.getSchedule(businessID,date);
  }

}
