import {
  Controller,
  Param,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Query,
  Delete,
  Headers,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ShedulesData, UpdateSchedules } from './dto/schedules.dto';
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
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader.replace('Bearer ', '');
    return this.schedulesService.createSchedule(
      scheduleData,
      businessId,
      token,
    );
  }

  //obtencion de los horarios

  @Get('business/:businessID')
  async getSchedules(
    @Param('businessID') businessID: string,
    @Query('date') date: string,
  ) {
    return this.schedulesService.getSchedule(businessID, date);
  }

  // update de los horarios
  @UseGuards(SchedulesOwnerGuard)
  @Patch(':scheduleID')
  async updateSchedule(
    @Param('scheduleID') scheduleID: string,
    @Body() updateData: UpdateSchedules,
    @Headers('authorization') authHeader: string,
  ) {
    return this.schedulesService.updateSchedules(
      scheduleID,
      updateData,
      authHeader,
    );
  }

  //eliminar horario
  @UseGuards(SchedulesOwnerGuard)
  @Delete(':scheduleID')
  async deleteSchedule(
    @Param('scheduleID') scheduleID: string,
    @Headers('authorization') authHeader: string,
  ) {
    return this.schedulesService.deleteSchedules(scheduleID, authHeader);
  }
}
