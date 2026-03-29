import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

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
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
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
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error ? error.message : null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const syncProfile = async (data: Partial<SupabaseProfile>) => {
    if (!user) return;
    await supabase.from('profiles').upsert({ id: user.id, ...data, updated_at: new Date().toISOString() });
    setProfile(prev => prev ? { ...prev, ...data } : null);
  };

  const generateInvite = async () => {
    if (!user) return '';
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    await supabase.from('couple_invites').insert({
      code,
      inviter_id: user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
    return code;
  };

  const acceptInvite = async (code: string) => {
    if (!user) return { error: 'Not signed in' };

    const { data: invite } = await supabase
      .from('couple_invites')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('used', false)
      .maybeSingle();

    if (!invite) return { error: 'Invalid or expired invite code' };
    if (invite.inviter_id === user.id) return { error: 'You cannot accept your own invite' };
    if (new Date(invite.expires_at) < new Date()) return { error: 'This invite has expired' };

    const { error: coupleError } = await supabase.from('couples').insert({
      user1_id: invite.inviter_id,
      user2_id: user.id,
    });

    if (coupleError) return { error: 'Failed to link accounts. You may already be linked.' };

    await supabase.from('couple_invites').update({ used: true, used_by: user.id }).eq('id', invite.id);
    await fetchUserData(user.id);
    return { error: null };
  };

  const refreshCouple = async () => {
    if (user) await fetchUserData(user.id);
  };

  return (
    <AuthContext.Provider value={{
      user, session, profile, partnerProfile, couple, loading,
      signUp, signIn, signOut, syncProfile, generateInvite, acceptInvite, refreshCouple,
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
