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
    console.log('[GET /users/me] Iniciado');
    const token = req.headers.authorization?.split(' ')[1];
    return this.usersService.getPorfile(token);
  }

  //actualiza algun campo del perfil
  @UseGuards(UsersGuard)
  @Patch('me')
  async updateMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    console.log('[PATCH /users/me] Iniciado');
    console.log('[PATCH /users/me] User ID from req.user:', req.user?.id);
    console.log('[PATCH /users/me] Update data received:', JSON.stringify(updateUserDto));
    console.log('[PATCH /users/me] Update data keys:', Object.keys(updateUserDto));
    console.log('[PATCH /users/me] Name value:', updateUserDto.name);
    console.log('[PATCH /users/me] Phone value:', updateUserDto.phone);
    console.log('[PATCH /users/me] Role value:', updateUserDto.role);
    
    return this.usersService.updatePorfile(req.user.id, updateUserDto);
  }

  //obtener cliente para ver perfil
  // IMPORTANTE: Esta ruta debe ir AL FINAL para no capturar 'me' como un :id
  @UseGuards(UsersGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    console.log('[GET /users/:id] Iniciado con id:', id);
    return this.usersService.getUserById(id);
  }
}
