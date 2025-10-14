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
    const token=authHeader?.split(' ')[1];
    const sb = token? createSupabaseClientForToken(token):supabase;
    const {data,error}=await sb 
      .from('Businesses')
      .select('*')

      if(error){
        throw new Error(error.message);
      }
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
