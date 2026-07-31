// Supabase integration client for GestãoPsi
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const DEFAULT_SUPABASE_KEY = 'sb_publishable_X1ArgGa46Hkyg13d3oDPqw_aZJiY4M5';
const DEFAULT_SUPABASE_URL = 'https://fdixndtvdborwgdizgqn.supabase.co';

function sanitizeSupabaseKey(key?: string): string {
  if (!key || typeof key !== 'string' || key.trim() === '' || key.includes('your_public_key')) {
    return DEFAULT_SUPABASE_KEY;
  }
  return key.trim();
}

function createSupabaseClient() {
  const rawUrl =
    import.meta.env.VITE_SUPABASE_URL ||
    (typeof process !== 'undefined' && (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)) ||
    DEFAULT_SUPABASE_URL;

  const rawKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    (typeof process !== 'undefined' && (process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY)) ||
    DEFAULT_SUPABASE_KEY;

  const SUPABASE_URL = rawUrl.trim();
  const SUPABASE_PUBLISHABLE_KEY = sanitizeSupabaseKey(rawKey);

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
      flowType: 'pkce',
      ...(typeof window !== 'undefined' && {
        redirectTo: `${window.location.origin}/auth/callback`,
      }),
    },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
