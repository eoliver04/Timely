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



export function createSupabaseClientForToken(token?: string): SupabaseClient {
  
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
  
  
  
  return client;
}

