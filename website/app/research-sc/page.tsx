import type { Metadata } from 'next';
import ResearchFormV2 from '../research-v2/ResearchFormV2';

export const metadata: Metadata = {
  title: 'Research — Hey Otis',
  description:
    'A short, evidence-based research survey to help shape Hey Otis. ~8 minutes, anonymous.',
  // Don't index — this is a partner-channel landing page.
  robots: { index: false, follow: false },
};

// Same survey as /research-v2 — this version is the SurveyCircle-dedicated
// landing page. Responses dual-write to the same `research_responses_v2`
// table so the existing dashboard captures everything in one place.
export default function ResearchSurveyCirclePage() {
  return (
    <main className="rs-main">
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <a href="/"><img src="/header-logo.png" alt="Hey Otis" className="nav-icon" /></a>
          </div>
          <a href="/" className="nav-cta">Back to site</a>
        </div>
      </nav>

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

      <section className="rs-form-section">
        <ResearchFormV2 defaultSrc="surveycircle" surveyCircleCode="LMFT-QNTY-19B3-QR8K" />

        <p className="rs-sc-ps">
          PS: SurveyCircle users receive points for their participation, which can
          be used to recruit free survey participants at{' '}
          <a href="https://www.surveycircle.com" target="_blank" rel="noopener noreferrer">
            SurveyCircle.com
          </a>
          .
        </p>
      </section>

      <footer className="ft">
        <p className="ft-brand">Hey Otis</p>
        <p className="ft-disc">Hey Otis supports but does not replace professional therapy.</p>
        <p className="ft-copy">&copy; 2026 Hey Otis. All rights reserved. &nbsp;|&nbsp; <a href="mailto:privacy@heyotis.app">privacy@heyotis.app</a></p>
      </footer>
    </main>
  );
}
