import { createClient } from '@supabase/supabase-js'

export function useSupabase() {
  const config = useRuntimeConfig()
  const supabaseUrl = String(config.public.supabaseUrl || '')
  const supabaseKey = String(config.public.supabasePublishableKey || '')

  if (!supabaseUrl || supabaseUrl.includes('tu-proyecto') || !supabaseKey || supabaseKey.includes('tu-publishable')) {
    throw new Error('Configura SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY en el archivo .env')
  }

  return createClient(supabaseUrl, supabaseKey)
}
