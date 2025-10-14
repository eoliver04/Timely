import { Injectable, NotFoundException } from '@nestjs/common';
import { supabase } from 'src/config/supabase.cliente';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  //para obtener el perfil
  async getPorfile(userId: string) {
    const { data, error } = await supabase.auth.getUser(userId);
      

    if (error) {
      throw new NotFoundException(error.message);
    }

    return data;
  }

  //para actuzalizar el perfil

  async updatePorfile(userId: string, updateUser: UpdateUserDto) {
    const { data, error } = await supabase
      .from('user_status')
      .update(updateUser)
      .eq('id', userId);
      
    if (error) {
      throw new NotFoundException(error.message);
    }
    return data;
  }
  

  //para obtenr info de un usuario
  async getUserById(userId:string){
    const {data,error}=await supabase
      .from('user_status')
      .select('*')
      .eq('id', userId)
      .single();

      if(error){
        throw new NotFoundException(error.message);
      }
      return data;
  }
}
