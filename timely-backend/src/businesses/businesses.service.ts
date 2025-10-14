import { Injectable } from '@nestjs/common';
import { clearSupabaseSession, supabase } from 'src/config/supabase.cliente';
import { CreateBusinessDTO, UpdateBusinessDTO } from './dto/businesses.dto';

@Injectable()
export class BusinessesService {
  //crear un negocio

  async createBusiness(businessesData: CreateBusinessDTO, ownerId: string) {
    
    const { data, error } = await supabase
      .from('Businesses')
      .insert({
        ...businessesData,
        owner_id: ownerId,
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
  //retirnar la lista de nogocios
  async getAllBusinesses(){
    await clearSupabaseSession();
    const {data,error}=await supabase 
      .from('Businesses')
      .select('*')

      if(error){
        throw new Error(error.message);
      }
      return data;
  }
  //retorna un nnegocio por un id 
  async getBussinesById(id:string){
     
    const{data,error}=await supabase
      .from('Businesses')
      .select('*')
      .eq('id', id)
      .single();

    if(error){
      throw new Error(error.message);
    }
    return data;
  }

  //update business 
  
  async updateBusiness(id:string, updateData: UpdateBusinessDTO){
    
    const {data,error}=await supabase 
      .from('Businesses')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if(error){
      throw new Error(error.message);
    }
    return data;
  }
  //retona los negocios de un admin
  async getBusinessesByAdmin(adminId:string){
    
    const{data,error}=await supabase
      .from('Businesses')
      .select('*')
      .eq('owner_id',adminId)

    if(error){
      throw new Error(error.message);
    }  
    return data;
  }

  //eliminar negocio
  async deleteBusiness(id:string){
    
    const {data,error}=await supabase
      .from('Businesses')
      .delete()
      .eq('id',id)

      if(error){
        throw new Error(error.message);
      }

      return data;

  }


}
