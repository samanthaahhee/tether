import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Public Supabase client for the marketing site. Used by /verified to
// exchange the recovery code for a session and call updateUser to set a
// new password without leaving the browser.
//
// Lazy-initialised so the static-export build doesn't try to instantiate
// the client at build time (env vars not present then). On first .auth
// access at runtime, env vars must be set:
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('Supabase env vars missing — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.');
  }
  client = createClient(url, anonKey, {
    auth: {
      // We don't want to persist the recovery session — one-shot password
      // change, not a full sign-in.
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return client;
}

// Proxy `supabase.auth.<method>` to the lazily-instantiated client.
export const supabase = {
  get auth() { return getClient().auth; },
};
