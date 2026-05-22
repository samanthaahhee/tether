import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// iOS Keychain (which expo-secure-store backs onto) caps each item at 2KB.
// Supabase sessions, especially Apple Sign-In ones with the identity_token,
// routinely exceed that — currently logs a warning, future SDK versions
// will throw outright. This adapter chunks large values across N+1 keys:
//   <key>          → manifest with chunk count
//   <key>.0..<key>.N → the chunks
// Reads reassemble transparently. Backwards-compatible with un-chunked values
// (treats a non-manifest read as a single item).
const CHUNK_SIZE = 1800; // leave headroom under the 2048-byte iOS limit

const SecureStoreAdapter = {
  getItem: async (key: string) => {
    const raw = await SecureStore.getItemAsync(key);
    if (!raw) return null;
    // Manifest format: starts with "chunked:<count>:"
    const match = raw.match(/^chunked:(\d+):$/);
    if (!match) return raw; // legacy un-chunked value
    const count = parseInt(match[1], 10);
    const parts: string[] = [];
    for (let i = 0; i < count; i++) {
      const part = await SecureStore.getItemAsync(`${key}.${i}`);
      if (part == null) return null; // corrupted; treat as missing
      parts.push(part);
    }
    return parts.join('');
  },
  setItem: async (key: string, value: string) => {
    // Clear any previous chunks before writing a new value, otherwise stale
    // chunks could leak into the next reassembly.
    const previous = await SecureStore.getItemAsync(key);
    const prevMatch = previous?.match(/^chunked:(\d+):$/);
    if (prevMatch) {
      const prevCount = parseInt(prevMatch[1], 10);
      for (let i = 0; i < prevCount; i++) {
        await SecureStore.deleteItemAsync(`${key}.${i}`).catch(() => {});
      }
    }
    if (value.length <= CHUNK_SIZE) {
      await SecureStore.setItemAsync(key, value);
      return;
    }
    const chunks: string[] = [];
    for (let i = 0; i < value.length; i += CHUNK_SIZE) chunks.push(value.slice(i, i + CHUNK_SIZE));
    await SecureStore.setItemAsync(key, `chunked:${chunks.length}:`);
    for (let i = 0; i < chunks.length; i++) await SecureStore.setItemAsync(`${key}.${i}`, chunks[i]);
  },
  removeItem: async (key: string) => {
    const raw = await SecureStore.getItemAsync(key);
    const match = raw?.match(/^chunked:(\d+):$/);
    if (match) {
      const count = parseInt(match[1], 10);
      for (let i = 0; i < count; i++) {
        await SecureStore.deleteItemAsync(`${key}.${i}`).catch(() => {});
      }
    }
    await SecureStore.deleteItemAsync(key);
  },
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
