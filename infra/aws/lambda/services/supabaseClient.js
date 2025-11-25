import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Lambda] SUPABASE_URL or SUPABASE_ANON_KEY missing in environment variables.');
}

export const supabaseClient = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    })
  : null;

export async function fetchLatestProfiles(limit = 10) {
  if (!supabaseClient) {
    throw new Error('Supabase client is not configured.');
  }

  const { data, error } = await supabaseClient
    .from('profiles')
    .select('id, name, user_type, turma_id, escola_id, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data;
}


