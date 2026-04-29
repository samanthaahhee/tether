import type { Metadata } from 'next';
import ResearchFormV2 from './ResearchFormV2';

export const metadata: Metadata = {
  title: 'Research v2 — Hey Otis',
  description:
    'A short, evidence-based research survey to help shape Hey Otis. ~6 minutes, anonymous.',
};

export default function ResearchV2Page() {
  return (
    <main className="rs-main">
      {/* Nav */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <a href="/"><img src="/header-logo.png" alt="Hey Otis" className="nav-icon" /></a>
          </div>
          <a href="/" className="nav-cta">Back to site</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="rs-hero">
        <div className="rs-hero-inner">
          <p className="rs-eyebrow">EARLY ACCESS</p>
          <h1 className="rs-h1">
            Help us build something{' '}<br />
            truly meaningful.
          </h1>
          <p className="rs-sub">
            Fill in this short survey and you&apos;ll be first in line for Hey Otis, a private
            guide that helps couples move from rupture to repair. Honest answers welcome,
            even uncomfortable ones. It takes about 8 minutes.
          </p>
          <p className="rs-meta">
            Anonymous · 8 minutes · ~25 questions
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="rs-form-section">
        <ResearchFormV2 />
      </section>

      {/* Footer */}
      <footer className="ft">
        <p className="ft-brand">Hey Otis</p>
        <p className="ft-disc">Hey Otis supports but does not replace professional therapy.</p>
        <p className="ft-copy">&copy; 2026 Hey Otis. All rights reserved. &nbsp;|&nbsp; <a href="mailto:privacy@heyotis.app">privacy@heyotis.app</a></p>
      </footer>
    </main>
  );
}
