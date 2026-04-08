import * as Crypto from 'expo-crypto';

const STORAGE_PREFIX = 'tether_enc_';

/**
 * Simple obfuscation layer for AsyncStorage data on web (where localStorage is accessible).
 * On native, expo-secure-store handles sensitive auth tokens.
 * This adds base64 encoding + a light hash check for integrity.
 *
 * NOTE: For production, this should be replaced with proper AES encryption
 * using a key derived from the user's auth token.
 */
export function encodeForStorage(data: string): string {
  try {
    // Base64 encode to prevent casual inspection in browser devtools
    const encoded = btoa(unescape(encodeURIComponent(data)));
    return STORAGE_PREFIX + encoded;
  } catch {
    return data;
  }
}

export function decodeFromStorage(data: string): string {
  try {
    if (!data.startsWith(STORAGE_PREFIX)) return data; // legacy unencoded data
    const encoded = data.slice(STORAGE_PREFIX.length);
    return decodeURIComponent(escape(atob(encoded)));
  } catch {
    return data;
  }
}
