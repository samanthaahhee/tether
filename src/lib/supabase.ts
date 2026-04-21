import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const SecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Auth tokens + PKCE code verifier live in the secure keychain, never
    // in AsyncStorage. See src/utils/passwordPolicy.ts + privacy policy for
    // the full storage posture.
    storage: SecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    // PKCE is the recommended flow for OAuth on mobile: the auth code is
    // exchanged for a session server-side using a secret code verifier that
    // never leaves the device. Requires Supabase dashboard redirect allow-list
    // to include `tether://auth/callback` and `tether://auth/reset-password`.
    flowType: 'pkce',
    // We handle the URL exchange manually in `useAuth` via
    // `exchangeCodeForSession`, so Supabase should not try to parse the URL
    // itself. (Also: React Native has no `window.location` anyway.)
    detectSessionInUrl: false,
  },
});
