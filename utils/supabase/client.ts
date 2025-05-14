// utils/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

let supabaseClient: ReturnType<typeof createClientComponentClient> | null = null;

export const createClient = () => {
  // Return the existing client if it's already created to prevent multiple instances
  if (supabaseClient) return supabaseClient;
  
  // Create a new client with explicit persistence options
  supabaseClient = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  });
  
  return supabaseClient;
};