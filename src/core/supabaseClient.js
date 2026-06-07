import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isPlaceholder = !supabaseUrl || supabaseUrl.includes('tuo-progetto-id');

if (isPlaceholder) {
  console.warn('⚠️ ATTENZIONE: Variabili di ambiente Supabase mancanti o non valide. Controlla il file .env.local');
}

// Creiamo un client fittizio o valido a seconda della situazione
export const supabase = createClient(
  isPlaceholder ? 'https://127.0.0.1.supabase.co' : supabaseUrl, 
  isPlaceholder ? 'dummy-key' : supabaseAnonKey,
  {
    global: {
      fetch: isPlaceholder ? async () => { throw new Error('Supabase non configurato') } : fetch
    }
  }
);
