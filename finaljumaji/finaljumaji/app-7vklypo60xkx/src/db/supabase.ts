import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { hasSupabaseCredentials, isDemoMode } from '@/config/demo';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseClient: SupabaseClient | null = null;

if (!isDemoMode && hasSupabaseCredentials && supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    throw new Error('Supabase client is not configured.');
  }

  return supabaseClient;
};

export const supabase = supabaseClient;
