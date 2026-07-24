import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
function isNewSupabaseApiKey(value) {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}
function createSupabaseClient() {
  const SUPABASE_URL = "https://fdixndtvdborwgdizgqn.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_X1ArgGa46Hkyg13d3oDPqw_aZJiY4M5";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY)
    },
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true,
      // PKCE é o fluxo mais seguro para SPAs — envia ?code= na query string
      // em vez de #access_token= no fragment, evitando exposição do token na URL.
      flowType: "pkce",
      // URL base para montar os redirects internos do SDK
      ...typeof window !== "undefined" && {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
export {
  supabase as s
};
