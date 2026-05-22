'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

/**
 * Public landing page for partner-invite share links.
 *
 * Receives the code as a query param (?code=ABC) rather than a route
 * param ([code]) — query params work with Next's static-export mode
 * (output: 'export') where route params require generateStaticParams()
 * which doesn't make sense for arbitrary dynamic invite codes.
 *
 * Flow:
 *   - Inviting partner taps "Share invite link" inside Hey Otis →
 *     generates `https://heyotis.app/invite?code=<CODE>`
 *   - Receiving partner taps the link in iMessage / WhatsApp / email
 *   - Lands here, sees a branded "You've been invited" page
 *   - Auto-attempts `tether://invite/<code>` deep link → app takes
 *     over, runs acceptInvite, pairs the couple. If no app installed
 *     → manual "Open Hey Otis" / "Get the app" fallback.
 */
function InviteInner() {
  const params = useSearchParams();
  const code = String(params.get('code') || '').toUpperCase();
  const [autoTried, setAutoTried] = useState(false);

  const deepLink = `tether://invite/${encodeURIComponent(code)}`;
  // TODO: replace with the real App Store URL once submission lands.
  const appStoreUrl = 'https://heyotis.app';

  useEffect(() => {
    if (autoTried || !code) return;
    setAutoTried(true);
    const t = setTimeout(() => {
      window.location.href = deepLink;
    }, 600);
    return () => clearTimeout(t);
  }, [autoTried, deepLink, code]);

  if (!code) {
    return (
      <main className="vfd">
        <div className="vfd-card">
          <div className="vfd-icon vfd-icon--err" aria-hidden="true">!</div>
          <h1 className="vfd-h1">Invite link broken</h1>
          <p className="vfd-body">This link is missing the invite code. Ask your partner to send a fresh one.</p>
          <Link href="/" className="vfd-link">Back to heyotis.app</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="vfd">
      <div className="vfd-card">
        <div className="vfd-icon" aria-hidden="true">✓</div>
        <h1 className="vfd-h1">You&apos;ve been invited</h1>
        <p className="vfd-body">
          Your partner is using Hey Otis and would like you to join. Tap below to open the app and accept the invite.
        </p>
        <a href={deepLink} className="vfd-btn">Open Hey Otis</a>
        <p className="vfd-fine">
          Don&apos;t have Hey Otis yet? <a href={appStoreUrl} className="vfd-link" style={{ display: 'inline' }}>Get the app</a>, then come back to this page.
        </p>
        <p className="vfd-fine" style={{ marginTop: 16 }}>
          Or paste this code inside the app under <strong>Settings → I have an invite code</strong>:
        </p>
        <p style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 22, fontWeight: 600, color: '#211e28', margin: '8px 0', letterSpacing: 2 }}>{code}</p>
      </div>
    </main>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={null}>
      <InviteInner />
    </Suspense>
  );
}
