'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

/**
 * Public landing page for partner-invite share links.
 *
 * Flow:
 *   - Inviting partner taps "Share invite link" inside Hey Otis →
 *     generates a Share with `https://heyotis.app/invite/<code>`
 *   - Receiving partner taps the link in iMessage / WhatsApp / email
 *   - Lands here, sees a branded "You've been invited" page
 *   - Tap "Open Hey Otis" → deep-links to `tether://invite/<code>`
 *     which (in production) opens the app, runs acceptInvite, pairs
 *     the couple. If the app isn't installed yet → App Store fallback.
 *
 * The previous share format was a raw `tether://invite/<code>` scheme
 * URL, which most messaging apps don't render as a tappable link and
 * which goes nowhere if the recipient doesn't have the app installed.
 */
export default function InvitePage() {
  const params = useParams();
  const code = String(params?.code || '').toUpperCase();
  const [autoTried, setAutoTried] = useState(false);

  const deepLink = `tether://invite/${encodeURIComponent(code)}`;
  // TODO: replace with the real App Store URL once submission lands.
  const appStoreUrl = 'https://heyotis.app';

  useEffect(() => {
    if (autoTried) return;
    setAutoTried(true);
    // Brief render of the celebratory state, then attempt the deep link.
    // If the app is installed, iOS takes over here and the user never
    // sees the rest of the page. If not, nothing happens visibly and
    // they fall back to the manual "Open Hey Otis" + "Get the app"
    // buttons.
    const t = setTimeout(() => {
      window.location.href = deepLink;
    }, 600);
    return () => clearTimeout(t);
  }, [autoTried, deepLink]);

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
