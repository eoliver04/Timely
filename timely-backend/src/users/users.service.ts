import { Injectable, NotFoundException } from '@nestjs/common';
import { supabase } from 'src/config/supabase.cliente';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  //para obtener el perfil
  async getPorfile(userId: string) {
    const { data, error } = await supabase.auth.getUser(userId);
      
    if (error) {
      console.error('[GET PROFILE] Auth error:', error);
      throw new NotFoundException(error.message);
    }

    // Obtener también los datos de user_status
    const { data: userStatus, error: statusError } = await supabase
      .from('user_status')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (statusError) {
      console.error('[GET PROFILE] user_status error:', statusError);
    }

    // Combinar datos de auth con user_status
    const combined = {
      ...data,
      user: {
        ...data.user,
        name: userStatus?.user_name || '',
        phone: userStatus?.phone || '',
        role: userStatus?.role || 'cliente',
      }
    };

    console.log('[GET PROFILE] Success:', combined);
    return combined;
  }

  //para actuzalizar el perfil

  async updatePorfile(userId: string, updateUser: UpdateUserDto) {
    console.log('[UPDATE PROFILE] userId:', userId);
    console.log('[UPDATE PROFILE] updateUser:', updateUser);
    
    // Mapear 'name' a 'user_name' para coincidir con la tabla
    const updateData: any = {};
    if (updateUser.name) {
      updateData.user_name = updateUser.name;
    }
    if (updateUser.phone) {
      updateData.phone = updateUser.phone;
    }
    
    console.log('[UPDATE PROFILE] Mapped data:', updateData);
    
    const { data, error } = await supabase
      .from('user_status')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      console.error('[UPDATE PROFILE] Error:', error);
      throw new NotFoundException(error.message);
    }
    
    console.log('[UPDATE PROFILE] Success:', data);
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
        console.error('[GET USER BY ID] Error:', error);
        throw new NotFoundException(error.message);
      }
      
      // Mapear user_name a name para consistencia con el frontend
      const mappedData = {
        ...data,
        name: data.user_name,
      };
      
      console.log('[GET USER BY ID] Success:', mappedData);
      return mappedData;
  }
}
