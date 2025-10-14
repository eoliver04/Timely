import * as dotenv from 'dotenv';
dotenv.config();

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.Supabase_Url as string;
const supabaseKey = process.env.Supabase_Key as string;

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey,{
    auth:{
        persistSession:false,
        autoRefreshToken:false,
        detectSessionInUrl:false,
    }
});

export const clearSupabaseSession=async()=>{
   try{
     await supabase.auth.signOut();
   }catch(error){
    console.log("Error limpiar session",error.message);
   }
}

export function createSupabaseClientForToken(token?: string): SupabaseClient {
  console.log('🔧 [createSupabaseClientForToken] Creando cliente con token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
  
  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      }
    }
  });
  
  console.log('🔧 [createSupabaseClientForToken] Cliente creado con headers:', {
    Authorization: token ? `Bearer ${token.substring(0, 20)}...` : 'undefined'
  });
  
  return client;
}

