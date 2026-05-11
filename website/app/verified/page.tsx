'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

/**
 * Public landing page for Supabase email-verification redirects.
 *
 * Two flows handled here:
 *
 *   1. Signup / magiclink / invite — show "You're verified", auto-attempt
 *      tether:// deep-link to bring the user back into the app where they
 *      finish onboarding or land in tabs.
 *
 *   2. Recovery (password reset) — show a real password reset form right
 *      on the page. Exchange the recovery code for a short-lived session,
 *      let the user pick a new password, call updateUser. No need for the
 *      app to be installed, no deep link required, works on desktop +
 *      every browser.
 */
function VerifiedInner() {
  const params = useSearchParams();
  const code = params.get('code');
  const error = params.get('error');
  const errorDescription = params.get('error_description');

  // Determine flow type from explicit `intent` first (we set this from
  // useAuth.resetPasswordForEmail), then Supabase's `type`, then URL
  // fragment for implicit flows. Default to signup.
  const fragment = typeof window !== 'undefined' ? window.location.hash.slice(1) : '';
  const fragmentType = new URLSearchParams(fragment).get('type');
  const intent = params.get('intent');
  const supabaseType = params.get('type') || fragmentType;
  const type = (intent || supabaseType || 'signup') as 'signup' | 'recovery' | 'magiclink' | 'invite';

  if (error) return <ErrorCard description={errorDescription} />;
  if (type === 'recovery') return <RecoveryForm code={code} />;
  return <DeepLinkCard type={type} code={code} />;
}

// ── Recovery: inline password reset form ──────────────────────────────────

function RecoveryForm({ code }: { code: string | null }) {
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [stage, setStage] = useState<'exchanging' | 'ready' | 'submitting' | 'done' | 'expired'>('exchanging');
  const [errMsg, setErrMsg] = useState('');

  // Exchange the one-time recovery code for a short-lived session so we
  // can call updateUser. This runs once on mount.
  useEffect(() => {
    if (!code) { setStage('expired'); setErrMsg('No reset code in this link.'); return; }
    supabase.auth.exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) { setStage('expired'); setErrMsg('This reset link has expired or already been used. Request a fresh one from the app.'); return; }
        setStage('ready');
      })
      .catch(() => { setStage('expired'); setErrMsg('Something went wrong. Try requesting a new reset link.'); });
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg('');
    if (pw1.length < 12) { setErrMsg('Password must be at least 12 characters.'); return; }
    if (!/[a-zA-Z]/.test(pw1) || !/\d/.test(pw1) || !/[^a-zA-Z0-9]/.test(pw1)) {
      setErrMsg('Password needs a letter, a number, and a symbol.');
      return;
    }
    if (pw1 !== pw2) { setErrMsg('Passwords don\'t match.'); return; }
    setStage('submitting');
    const { error } = await supabase.auth.updateUser({ password: pw1 });
    if (error) {
      setStage('ready');
      setErrMsg(error.message);
      return;
    }
    setStage('done');
  };

  if (stage === 'expired') return <ErrorCard description={errMsg} />;
  if (stage === 'done') {
    return (
      <main className="vfd">
        <div className="vfd-card">
          <div className="vfd-icon" aria-hidden="true">✓</div>
          <h1 className="vfd-h1">Password updated</h1>
          <p className="vfd-body">You can now sign in with your new password in Hey Otis.</p>
          <a href="tether://auth/sign-in" className="vfd-btn">Open Hey Otis</a>
          <p className="vfd-fine">Don&apos;t have the app open? Sign in directly inside Hey Otis on your phone.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="vfd">
      <div className="vfd-card">
        <div className="vfd-icon" aria-hidden="true">✓</div>
        <h1 className="vfd-h1">Reset your password</h1>
        <p className="vfd-body">Choose a new password for your Hey Otis account.</p>

        {stage === 'exchanging' ? (
          <p className="vfd-fine">Verifying link…</p>
        ) : (
          <form onSubmit={handleSubmit} className="vfd-form">
            <label className="vfd-label">
              New password
              <input
                type="password"
                value={pw1}
                onChange={(e) => setPw1(e.target.value)}
                placeholder="At least 12 characters"
                autoComplete="new-password"
                className="vfd-input"
                required
              />
            </label>
            <p className="vfd-hint">Needs a letter, a number, and a symbol.</p>

            <label className="vfd-label">
              Confirm new password
              <input
                type="password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                placeholder="Repeat your new password"
                autoComplete="new-password"
                className="vfd-input"
                required
              />
            </label>

            {errMsg && <p className="vfd-error">{errMsg}</p>}

            <button type="submit" disabled={stage === 'submitting'} className="vfd-btn vfd-btn--full">
              {stage === 'submitting' ? 'Updating…' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

// ── Signup / magiclink / invite: deep-link card ───────────────────────────

function DeepLinkCard({ type, code }: { type: 'signup' | 'magiclink' | 'invite'; code: string | null }) {
  const [autoTried, setAutoTried] = useState(false);

  const deepLink = code
    ? `tether://auth/callback?code=${encodeURIComponent(code)}`
    : 'tether://auth/callback';

  const copy = (() => {
    switch (type) {
      case 'magiclink': return { heading: "You're signed in", body: 'Tap below to open Hey Otis and continue.', cta: 'Open Hey Otis' };
      case 'invite':    return { heading: "You've been invited", body: 'Tap below to open Hey Otis and accept the invite.', cta: 'Accept invite' };
      default:          return { heading: "You're verified", body: 'Your email is confirmed. Tap below to open Hey Otis and finish setting up your account.', cta: 'Open Hey Otis' };
    }
  })();

  useEffect(() => {
    if (autoTried) return;
    setAutoTried(true);
    const t = setTimeout(() => { window.location.href = deepLink; }, 600);
    return () => clearTimeout(t);
  }, [autoTried, deepLink]);

  return (
    <main className="vfd">
      <div className="vfd-card">
        <div className="vfd-icon" aria-hidden="true">✓</div>
        <h1 className="vfd-h1">{copy.heading}</h1>
        <p className="vfd-body">{copy.body}</p>
        <a href={deepLink} className="vfd-btn">{copy.cta}</a>
        <p className="vfd-fine">Don&apos;t have the app open? You can also continue directly inside Hey Otis on your phone.</p>
      </div>
    </main>
  );
}

// ── Error state ──────────────────────────────────────────────────────────

function ErrorCard({ description }: { description: string | null }) {
  return (
    <main className="vfd">
      <div className="vfd-card">
        <div className="vfd-icon vfd-icon--err" aria-hidden="true">!</div>
        <h1 className="vfd-h1">Link didn&apos;t work</h1>
        <p className="vfd-body">{description || 'This link may have expired or already been used.'}</p>
        <p className="vfd-body">Open Hey Otis on your phone and request a fresh link.</p>
        <Link href="/" className="vfd-link">Back to heyotis.app</Link>
      </div>
    </main>
  );
}

export default function Verified() {
  return (
    <Suspense fallback={null}>
      <VerifiedInner />
    </Suspense>
  );
}
