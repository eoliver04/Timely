import { Injectable } from '@nestjs/common';
import { clearSupabaseSession, createSupabaseClientForToken, supabase } from 'src/config/supabase.cliente';
import { CreateBusinessDTO, UpdateBusinessDTO } from './dto/businesses.dto';

@Injectable()
export class BusinessesService {
  //crear un negocio

  async createBusiness(businessesData: CreateBusinessDTO, ownerId: string, authHeader?: string) {
    const token = authHeader?.split(' ')[1];
    const sb = token ? createSupabaseClientForToken(token) : supabase;
    
    const { data, error } = await sb
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
  async getAllBusinesses(authHeader?:string){
    console.log('🔍 [getAllBusinesses] Iniciando método');
    console.log('🔍 [getAllBusinesses] authHeader recibido:', authHeader);
    
    const token=authHeader?.split(' ')[1];
    console.log('🔍 [getAllBusinesses] Token extraído:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    
    const sb = token? createSupabaseClientForToken(token):supabase;
    console.log('🔍 [getAllBusinesses] Cliente Supabase:', token ? 'Con token autenticado' : 'Cliente anónimo');
    
    const {data,error}=await sb 
      .from('Businesses')
      .select('*')

    console.log('🔍 [getAllBusinesses] Resultado de Supabase:');
    console.log('   - Data:', data);
    console.log('   - Error:', error);
    console.log('   - Data length:', data?.length || 0);

      if(error){
        console.log('❌ [getAllBusinesses] Error en query:', error.message);
        throw new Error(error.message);
      }
      
      console.log('✅ [getAllBusinesses] Retornando data:', data);
      return data;
  }
  //retorna un nnegocio por un id 
  async getBussinesById(id: string, authHeader?: string){
    const token = authHeader?.split(' ')[1];
    const sb = token ? createSupabaseClientForToken(token) : supabase;
     
    const{data,error}=await sb
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
  
  async updateBusiness(id: string, updateData: UpdateBusinessDTO, authHeader?: string){
    const token = authHeader?.split(' ')[1];
    const sb = token ? createSupabaseClientForToken(token) : supabase;
    
    const {data,error}=await sb 
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
  async getBusinessesByAdmin(adminId: string, authHeader?: string){
    const token = authHeader?.split(' ')[1];
    const sb = token ? createSupabaseClientForToken(token) : supabase;
    
    const{data,error}=await sb
      .from('Businesses')
      .select('*')
      .eq('owner_id',adminId)

    if(error){
      throw new Error(error.message);
    }  
    return data;
  }

  //eliminar negocio
  async deleteBusiness(id: string, authHeader?: string){
    const token = authHeader?.split(' ')[1];
    const sb = token ? createSupabaseClientForToken(token) : supabase;
    
    const {data,error}=await sb
      .from('Businesses')
      .delete()
      .eq('id',id)

      if(error){
        throw new Error(error.message);
      }

      return data;

  }


}
