'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

/**
 * Public landing page for Supabase email-verification redirects.
 *
 * Supabase email link → Supabase verifies → redirects HERE with `?code=...`.
 * We immediately attempt to bounce the user into the native app via the
 * `tether://auth/callback?code=...` deep link, so the auth code is exchanged
 * for a session inside the app and the user lands signed in.
 *
 * If the deep link fails (browser blocks it, app not installed, opened on
 * desktop), the user sees a clear "Verified!" confirmation + a manual
 * "Open Hey Otis" button, so the moment never feels broken.
 */
function VerifiedInner() {
  const params = useSearchParams();
  const code = params.get('code');
  const error = params.get('error');
  const errorDescription = params.get('error_description');
  // Determine which auth flow this is, in this priority order:
  //   1. Our explicit `intent` query param (set by useAuth's signUp /
  //      resetPasswordForEmail calls). Most reliable.
  //   2. Supabase's `type` query param (sometimes appended, sometimes not
  //      depending on the flow + Supabase version).
  //   3. URL fragment for implicit flows (e.g. `#type=recovery&...`).
  //   4. Default to signup.
  const fragment = typeof window !== 'undefined' ? window.location.hash.slice(1) : '';
  const fragmentType = new URLSearchParams(fragment).get('type');
  const intent = params.get('intent');
  const supabaseType = params.get('type') || fragmentType;
  const type = (intent || supabaseType || 'signup') as 'signup' | 'recovery' | 'magiclink' | 'invite';
  const [autoTried, setAutoTried] = useState(false);

  const deepLinkPath = type === 'recovery' ? 'auth/reset-password' : 'auth/callback';
  const deepLink = code
    ? `tether://${deepLinkPath}?code=${encodeURIComponent(code)}`
    : `tether://${deepLinkPath}`;

  const copy = (() => {
    switch (type) {
      case 'recovery':  return { heading: 'Reset your password', body: 'Tap below to open Hey Otis and choose a new password.', cta: 'Open Hey Otis' };
      case 'magiclink': return { heading: "You're signed in", body: 'Tap below to open Hey Otis and continue.', cta: 'Open Hey Otis' };
      case 'invite':    return { heading: "You've been invited", body: 'Tap below to open Hey Otis and accept the invite.', cta: 'Accept invite' };
      default:          return { heading: "You're verified", body: 'Your email is confirmed. Tap below to open Hey Otis and finish setting up your account.', cta: 'Open Hey Otis' };
    }
  })();

  // Auto-attempt the deep link once on mount. If the OS opens the app, the
  // user never even sees this page. If nothing happens (desktop / no app),
  // the manual button below still works.
  useEffect(() => {
    if (autoTried || error) return;
    setAutoTried(true);
    // Small delay so the page has time to render the celebratory state
    // first — feels less jarring than an immediate scheme switch.
    const t = setTimeout(() => {
      window.location.href = deepLink;
    }, 600);
    return () => clearTimeout(t);
  }, [autoTried, deepLink, error]);

  return (
    <main className="vfd">
      {error ? (
        <div className="vfd-card">
          <div className="vfd-icon vfd-icon--err" aria-hidden="true">!</div>
          <h1 className="vfd-h1">Link didn&apos;t work</h1>
          <p className="vfd-body">
            {errorDescription || 'This verification link may have expired or already been used.'}
          </p>
          <p className="vfd-body">
            Open Hey Otis on your phone and tap <strong>Send a new link</strong> to try again.
          </p>
          <Link href="/" className="vfd-link">Back to heyotis.app</Link>
        </div>
      ) : (
        <div className="vfd-card">
          <div className="vfd-icon" aria-hidden="true">✓</div>
          <h1 className="vfd-h1">{copy.heading}</h1>
          <p className="vfd-body">{copy.body}</p>
          <a href={deepLink} className="vfd-btn">{copy.cta}</a>
          <p className="vfd-fine">
            Don&apos;t have the app open? You can also continue directly inside Hey Otis on your phone.
          </p>
        </div>
      )}
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
