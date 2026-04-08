/**
 * Centralized API layer — all data operations go through here.
 * Currently uses Supabase client SDK directly.
 *
 * TODO: For production, replace each method with a call to a
 * Supabase Edge Function to keep DB access server-side only.
 */
import { supabase } from './supabase';

export const api = {
  /** Sync user profile to database */
  async syncProfile(userId: string, data: Record<string, any>) {
    return supabase.from('profiles').upsert({
      id: userId,
      ...data,
      updated_at: new Date().toISOString()
    });
  },

  /** Generate an invite code */
  async createInvite(userId: string) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    await supabase.from('couple_invites').insert({
      code,
      inviter_id: userId,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
    return code;
  },

  /** Accept an invite code */
  async acceptInvite(userId: string, code: string) {
    const { data: invite } = await supabase
      .from('couple_invites')
      .select('*')
      .eq('code', code)
      .single();

    if (!invite) return { error: 'Invalid invite code' };
    if (new Date(invite.expires_at) < new Date()) return { error: 'Invite code expired' };
    if (invite.inviter_id === userId) return { error: 'Cannot accept your own invite' };

    await supabase.from('couples').insert({
      user_a: invite.inviter_id,
      user_b: userId,
    });

    return { error: null };
  },
};
