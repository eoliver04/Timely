import { Module } from '@nestjs/common';
import { AppointmetsService } from './appointmets.service';
import { AppointmetsController } from './appointmets.controller';

@Module({
  controllers: [AppointmetsController],
  providers: [AppointmetsService],
})
export class AppointmetsModule {}
