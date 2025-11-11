import { Controller } from '@nestjs/common';
import { AppointmetsService } from './appointmets.service';

@Controller('appointmets')
export class AppointmetsController {
  constructor(private readonly appointmetsService: AppointmetsService) {}
}
