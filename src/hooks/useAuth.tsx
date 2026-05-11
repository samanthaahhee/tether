import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import * as AppleAuthentication from 'expo-apple-authentication';
import { router } from 'expo-router';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Base-36 char pool; 12 chars = 36^12 ≈ 4.7e18 combinations. Upper-case only
// so users can read/type the code from a message without case confusion.
const INVITE_CODE_LENGTH = 12;
const INVITE_CODE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

async function generateSecureInviteCode(): Promise<string> {
  // Use a CSPRNG rather than Math.random for guessing-resistance.
  const bytes = await Crypto.getRandomBytesAsync(INVITE_CODE_LENGTH);
  let out = '';
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
    out += INVITE_CODE_ALPHABET[bytes[i] % INVITE_CODE_ALPHABET.length];
  }
  return out;
}

export interface SupabaseProfile {
  id: string;
  name: string;
  attachment: string;
  conflict: string;
  love: string;
  window: string;
  need: string;
  context: string;
  onboarded: boolean;
  avatar_color: string;
}

export interface CoupleInfo {
  id: string;
  partnerId: string;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: SupabaseProfile | null;
  partnerProfile: SupabaseProfile | null;
  couple: CoupleInfo | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsVerification?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInWithApple: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  resendVerification: (email: string) => Promise<{ error: string | null }>;
  syncProfile: (data: Partial<SupabaseProfile>) => Promise<void>;
  generateInvite: () => Promise<string>;
  acceptInvite: (code: string) => Promise<{ error: string | null }>;
  refreshCouple: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<SupabaseProfile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<SupabaseProfile | null>(null);
  const [couple, setCouple] = useState<CoupleInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setProfile(null);
        setPartnerProfile(null);
        setCouple(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Background-refresh lifecycle. Without this, Supabase's token refresh timer
   * stops firing when the app is backgrounded — users come back after an hour
   * and find themselves silently signed out.
   */
  useEffect(() => {
    if (AppState.currentState === 'active') {
      supabase.auth.startAutoRefresh();
    }
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });
    return () => sub.remove();
  }, []);

  /**
   * Deep-link handler — covers both warm (app running) and cold-start
   * (app launched from the email/OAuth link) cases. Supabase email and
   * OAuth redirects land here as `tether://auth/callback?code=...` or
   * `tether://auth/reset-password?code=...`. We exchange the code for a
   * session and route the user onward if it's a password-reset flow.
   */
  useEffect(() => {
    let cancelled = false;

    const handleUrl = async (incomingUrl: string | null) => {
      if (cancelled || !incomingUrl) return;
      let parsed: URL;
      try { parsed = new URL(incomingUrl); } catch { return; }

      // Expo Linking gives us `tether://auth/callback?...`. In React Native's
      // URL polyfill, that lands as host='auth' pathname='/callback'. Handle
      // both scheme-first and pathname-first parsers.
      const pathParts = [parsed.host, parsed.pathname].join('/').replace(/\/+/g, '/');
      const isResetPassword = /\/auth\/reset-password/.test(pathParts) || pathParts.includes('reset-password');
      const isAuthCallback = /\/auth\/callback/.test(pathParts);

      if (!isResetPassword && !isAuthCallback) return;

      const code = parsed.searchParams.get('code');
      if (!code) return;

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError || cancelled) return;

      if (isResetPassword) {
        router.replace('/auth/reset-password');
      }
      // For OAuth callback, onAuthStateChange will fire and RouteGuard routes
      // onward — no explicit navigation needed here.
    };

    // Cold start — app was launched by tapping the link
    Linking.getInitialURL().then(handleUrl);

    // Warm — app already running, link tapped from mail client
    const sub = Linking.addEventListener('url', ({ url }: { url: string }) => { handleUrl(url); });

    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData) setProfile(profileData);

      const { data: coupleData } = await supabase
        .from('couples')
        .select('*')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .maybeSingle();

      if (coupleData) {
        const partnerId = coupleData.user1_id === userId
          ? coupleData.user2_id
          : coupleData.user1_id;
        setCouple({ id: coupleData.id, partnerId });

        const { data: partnerData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', partnerId)
          .single();

        if (partnerData) setPartnerProfile(partnerData);
      } else {
        setCouple(null);
        setPartnerProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Supabase dashboard must list this redirect URL in the allow-list.
        emailRedirectTo: 'https://heyotis.app/verified',
      },
    });
    if (error) return { error: error.message };
    // When dashboard "Confirm email" is ON, Supabase returns a user but no session —
    // signalling verification is required before the user can sign in.
    const needsVerification = !data.session && !data.user?.email_confirmed_at;
    return { error: null, needsVerification };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'tether://auth/reset-password',
    });
    // Do not surface "user not found" — always return success from the UI to
    // avoid leaking which emails are registered. Only propagate rate-limit /
    // infrastructure errors.
    if (error && !/not found|invalid email/i.test(error.message)) {
      return { error: error.message };
    }
    return { error: null };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    // Invalidate any sessions on other devices. "others" keeps the current
    // session valid so the user stays signed in where they just reset.
    await supabase.auth.signOut({ scope: 'others' });
    return { error: null };
  };

  const resendVerification = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: 'tether://auth/callback' },
    });
    return { error: error ? error.message : null };
  };

  const signOut = async () => {
    // Clear state immediately so RouteGuard redirects
    setUser(null);
    setSession(null);
    setProfile(null);
    setPartnerProfile(null);
    setCouple(null);
    // Clear locally-cached app state so the next person to sign in on
    // this device does NOT see the previous user's sessions, learnings,
    // partner observations, or profile name.
    try {
      await AsyncStorage.multiRemove(['tether_state', 'tether_app_state']);
    } catch (e) {
      // Don't block sign-out on a cache-clear failure — the auth wipe is
      // the security-critical part. Log so we know if it's failing in the wild.
      console.warn('signOut: failed to clear local cache', e);
    }
    // Then sign out from Supabase
    await supabase.auth.signOut();
  };

  const signInWithGoogle = async (): Promise<{ error: string | null }> => {
    const redirectUrl = 'tether://auth/callback';
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });
      if (error) return { error: error.message };
      if (!data?.url) return { error: 'Could not start Google sign-in.' };

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      if (result.type !== 'success' || !result.url) {
        // User dismissed the browser, cancelled, or the OAuth flow failed.
        // We do NOT surface the internal reason — avoid leaking state to the user.
        return { error: 'Google sign-in was cancelled.' };
      }

      // PKCE flow: callback URL has a `?code=...` query param. Exchange it
      // for a session via Supabase, which handles the PKCE verifier from
      // secure storage internally.
      let code: string | null = null;
      try {
        const parsed = new URL(result.url);
        code = parsed.searchParams.get('code');
      } catch {
        return { error: 'Malformed callback URL.' };
      }
      if (!code) return { error: 'No authorisation code returned.' };

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) return { error: exchangeError.message };
      return { error: null };
    } catch (e: any) {
      return { error: e?.message || 'Google sign-in failed.' };
    }
  };

  /**
   * Sign in with Apple — required by Apple Guideline 4.8 because we also
   * offer Google sign-in. Uses the native iOS Sign in with Apple sheet
   * (no browser redirect), passes the returned identity token straight to
   * Supabase via signInWithIdToken — which is faster, more reliable, and
   * doesn't need any redirect-URL allow-list config.
   *
   * Apple-only: on Android we no-op with a clear message. The button is
   * also conditionally rendered on iOS only.
   */
  const signInWithApple = async (): Promise<{ error: string | null }> => {
    if (Platform.OS !== 'ios') {
      return { error: 'Sign in with Apple is only available on iOS.' };
    }
    try {
      const available = await AppleAuthentication.isAvailableAsync();
      if (!available) {
        return { error: 'Sign in with Apple is not available on this device.' };
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        return { error: 'Apple sign-in did not return an identity token.' };
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (e: any) {
      // User-cancellation throws an ERR_REQUEST_CANCELED. Don't surface
      // that as a real error — the UX is identical to "user dismissed".
      if (e?.code === 'ERR_REQUEST_CANCELED') {
        return { error: 'Apple sign-in was cancelled.' };
      }
      return { error: e?.message || 'Apple sign-in failed.' };
    }
  };

  const syncProfile = async (data: Partial<SupabaseProfile>) => {
    if (!user) return;
    await supabase.from('profiles').upsert({ id: user.id, ...data, updated_at: new Date().toISOString() });
    setProfile(prev => prev ? { ...prev, ...data } : null);
  };

  const generateInvite = async () => {
    if (!user) return '';
    // Hey Otis only supports one partner per user. Refuse to generate
    // a new invite if the user is already coupled — the DB trigger
    // also blocks this, but client-side rejection is faster + clearer.
    if (couple) return '';
    const code = await generateSecureInviteCode();
    // RLS "Users can create invites" with check `inviter_id = auth.uid()`
    // prevents spoofing inviter_id, but we also set it explicitly here as
    // defence-in-depth.
    const { error } = await supabase.from('couple_invites').insert({
      code,
      inviter_id: user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
    if (error) return '';
    return code;
  };

  /**
   * Invite acceptance goes through an atomic Postgres RPC (public.accept_invite)
   * rather than a 3-step client dance. That:
   *   - Re-verifies the caller's identity via auth.uid() server-side, so even
   *     a spoofed client payload can't impersonate another user.
   *   - Holds a row-level lock on the invite for the duration, preventing
   *     race conditions where two clients accept the same invite.
   *   - Returns a well-defined status code the UI can switch on.
   *
   * The RLS policies on couple_invites are now scoped to the inviter only —
   * accepters have no direct read/write access to the table, closing the
   * previous enumeration hole.
   */
  const acceptInvite = async (code: string) => {
    if (!user) return { error: 'You must be signed in to accept an invite.' };

    const { data, error } = await supabase.rpc('accept_invite', {
      invite_code: code.toUpperCase().trim(),
    });

    if (error) return { error: 'We couldn\'t accept the invite right now. Please try again.' };

    // RPC returns a single-row table: [{ status, message, couple_id }].
    const result = Array.isArray(data) ? data[0] : data;
    if (!result) return { error: 'Invalid or expired invite code.' };

    switch (result.status) {
      case 'ok':
      case 'already_linked':
        await fetchUserData(user.id);
        return { error: null };
      case 'invalid':
      case 'expired':
      case 'used':
      case 'self':
        return { error: result.message || 'Invalid or expired invite code.' };
      default:
        return { error: 'We couldn\'t accept the invite right now.' };
    }
  };

  const refreshCouple = async () => {
    if (user) await fetchUserData(user.id);
  };

  return (
    <AuthContext.Provider value={{
      user, session, profile, partnerProfile, couple, loading,
      signUp, signIn, signOut, signInWithGoogle, signInWithApple,
      resetPassword, updatePassword, resendVerification,
      syncProfile, generateInvite, acceptInvite, refreshCouple,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
