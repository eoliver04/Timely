import { Controller,Post,Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userDto: AuthDto) {
    return this.authService.register(userDto);
  }

  @Post('login')
  async login(@Body() userDto: AuthDto) {
    return this.authService.login(userDto.email, userDto.password);
  }
}

