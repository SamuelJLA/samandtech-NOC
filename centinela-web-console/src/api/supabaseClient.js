import { createClient } from '@supabase/supabase-js';

// Usamos import.meta.env para mayor seguridad
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ Error: Faltan las credenciales de Supabase en el archivo .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);