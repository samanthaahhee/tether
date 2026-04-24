import type { Metadata } from 'next';
import ResearchForm from './ResearchForm';

export const metadata: Metadata = {
  title: 'Research, Hey Otis',
  description:
    'Help shape Hey Otis. A 3-minute questionnaire on relationships, communication, conflict, and AI.',
};

export default function ResearchPage() {
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
          <p className="rs-eyebrow">RESEARCH</p>
          <h1 className="rs-h1">
            Help us build something<br />
            couples actually want.
          </h1>
          <p className="rs-sub">
            We&apos;re building Hey Otis, a private guide that helps couples move from rupture
            to repair. Before we go further, we want to hear from you. This takes about
            4 minutes. Honest answers welcome, even uncomfortable ones.
          </p>
          <p className="rs-meta">
            Anonymous by default · Email is optional at the end · ~16 questions
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="rs-form-section">
        <ResearchForm />
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
