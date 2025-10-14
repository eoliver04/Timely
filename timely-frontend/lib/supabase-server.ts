import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Supabase client for server-side operations
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  )

  return supabase
}
