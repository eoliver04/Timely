let supabaseClient: any = null

export function createClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn(
      "[Timely] Supabase not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    )
    return null
  }

  if (!supabaseClient) {
    // Lazy load Supabase only when needed and configured
    const { createClient: createSupabaseClient } = require("@supabase/supabase-js")
    supabaseClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    )
  }

  return supabaseClient
}

// Helper to get the current user's access token
export async function getAccessToken() {
  const supabase = createClient()
  if (!supabase) return null

  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token || null
}

// Helper to get the current user
export async function getCurrentUser() {
  const supabase = createClient()
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
