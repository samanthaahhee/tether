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
  const [autoTried, setAutoTried] = useState(false);

  // Build the deep link with the original query params so the app can
  // exchange the code for a session.
  const deepLink = code
    ? `tether://auth/callback?code=${encodeURIComponent(code)}`
    : 'tether://auth/callback';

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
          <h1 className="vfd-h1">You&apos;re verified</h1>
          <p className="vfd-body">
            Your email is confirmed. Tap below to open Hey Otis and finish setting up your account.
          </p>
          <a href={deepLink} className="vfd-btn">Open Hey Otis</a>
          <p className="vfd-fine">
            Don&apos;t have the app open? You can also sign in directly inside Hey Otis on your phone.
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
