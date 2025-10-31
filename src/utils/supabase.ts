import { createClient } from "@supabase/supabase-js";

// Prefer Vite envs; fallback to CRA-style if provided
const supabaseUrl =
  (import.meta as any).env?.VITE_SUPABASE_URL || (typeof process !== "undefined" ? (process as any).env?.REACT_APP_SUPABASE_URL : undefined);
const supabaseKey =
  (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || (typeof process !== "undefined" ? (process as any).env?.REACT_APP_SUPABASE_ANON_KEY : undefined);

export const supabase = createClient(supabaseUrl, supabaseKey);


