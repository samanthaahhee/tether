'use client';

import { useState, FormEvent } from 'react';

// Supabase public values — anon key is safe in the client bundle.
// Set in Vercel project env (Production + Preview + Development).
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function WaitlistForm({ variant = 'cta' }: { variant?: 'cta' | 'hero' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email.');
      return;
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setStatus('error');
      setMessage('Waitlist is temporarily unavailable.');
      return;
    }

    setStatus('sending');
    setMessage('');

    try {
      const referrer = document.referrer
        ? new URL(document.referrer).hostname
        : new URLSearchParams(window.location.search).get('src') || 'direct';

      const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist_signups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          email: trimmed,
          referrer,
          user_agent: navigator.userAgent.slice(0, 200),
        }),
      });

      // 409 = duplicate email. Always respond identically to real success —
      // we must never confirm whether an email is on the list.
      if (res.ok || res.status === 409) {
        setStatus('success');
        setMessage("You're on the list. I'll email when it opens.");
        setEmail('');
      } else {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network hiccup. Please try again.');
    }
  }

  return (
    <form className={`wl wl--${variant}`} onSubmit={handleSubmit} noValidate>
      <div className="wl-row">
        <input
          type="email"
          name="email"
          className="wl-input"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'sending'}
          required
        />
        <button
          type="submit"
          className="btn-primary btn-lg wl-submit"
          disabled={status === 'sending' || status === 'success'}
        >
          {status === 'sending' ? 'Sending…' : status === 'success' ? 'Added ✓' : 'Join the waitlist'}
        </button>
      </div>
      <p className={`wl-msg ${status === 'error' ? 'wl-msg--error' : status === 'success' ? 'wl-msg--success' : ''}`}>
        {message || 'No spam. One email when it opens.'}
      </p>
    </form>
  );
}
