import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UsersModule } from './users/users.module';
import { BusinessesModule } from './businesses/businesses.module';

@Module({
  imports: [AuthModule, UsersModule, BusinessesModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
