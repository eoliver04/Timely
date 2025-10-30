import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UsersModule } from './users/users.module';
import { BusinessesModule } from './businesses/businesses.module';
import { SchedulesModule } from './schedules/schedules.module';


@Module({
  imports: [AuthModule, UsersModule, BusinessesModule, SchedulesModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
