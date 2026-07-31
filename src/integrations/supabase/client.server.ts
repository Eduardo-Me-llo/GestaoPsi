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

function createSupabaseAdminClient() {
  const rawUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    DEFAULT_SUPABASE_URL;
  const rawKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    DEFAULT_SUPABASE_KEY;

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn(`[Supabase Admin] SUPABASE_SERVICE_ROLE_KEY missing. Privileged admin actions will use default client capabilities.`);
  }

  const SUPABASE_URL = rawUrl.trim();
  const SUPABASE_SERVICE_ROLE_KEY = sanitizeSupabaseKey(rawKey);

  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let _supabaseAdmin: ReturnType<typeof createSupabaseAdminClient> | undefined;

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseAdminClient>, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  },
});
