import { Controller, Get, Patch, Req, UseGuards, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersGuard } from './user.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //obtiene el perfil del usario 
  @UseGuards(UsersGuard)
  @Get('me')
  async getMe(@Req() req) {
    const token = req.headers.authorization?.split(' ')[1]; // Extraer el token del encabezado
    return this.usersService.getPorfile(token);
  }

  //actualiza algun campo del perfil
  @UseGuards(UsersGuard)
  @Patch('me')
  async updateMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updatePorfile(req.user.id, updateUserDto);
  }

  //obtener cliente para ver perfil
  @UseGuards(UsersGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
 
}
