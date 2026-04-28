import StepsSection from './StepsSection';
import ScrollReveal from './ScrollReveal';
import WaitlistForm from './WaitlistForm';

export default function Home() {
  return (
    <main>
      {/* ── Nav ── */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <img src="/header-logo.png" alt="Hey Otis" className="nav-icon" />
          </div>
          <a href="/research?src=nav" className="nav-cta">Get early access</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-text">
            <ScrollReveal delay={100}>
              <h1 className="hero-h1">
                Every couple argues.
                The ones that last,
                learn how to repair.
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="hero-sub">
                A private space to process your conflict, figure out what&apos;s
                really going on, and help you find the words to have a healthier
                conversation your partner can hear.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="hero-actions">
                <a href="#get-started" className="btn-primary btn-lg">Join the waitlist</a>
                <a href="#how" className="btn-ghost btn-lg">See how it works</a>
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={200} className="hero-image-wrap">
            <img src="/hero-image.png" alt="Hey Otis app" className="hero-image" />
          </ScrollReveal>
        </div>
      </section>

      {/* ── Proof Bar ── */}
      <section className="proof-bar">
        <ScrollReveal>
          <div className="proof-inner">
            <div className="proof-item">
              <svg className="proof-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#81b756" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <span className="proof-label">5 Evidence Based Frameworks</span>
            </div>
            <div className="proof-item">
              <svg className="proof-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#81b756" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .963L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>
              <span className="proof-label">4 Guided Repair Steps</span>
            </div>
            <div className="proof-item">
              <svg className="proof-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#81b756" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <span className="proof-label">100% Private &amp; Secure</span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── The Reality ── */}
      <section className="reality">
        <div className="reality-container">
          <ScrollReveal>
            <div className="reality-header">
              <p className="reality-eyebrow">THE REALITY</p>
              <h2 className="reality-title">Conflict isn&apos;t the problem. Silence is.</h2>
              <p className="reality-sub">Most couples don&apos;t break up because they fight. They break up because they stop trying to understand each other.</p>
            </div>
          </ScrollReveal>
          <div className="reality-row">
            <ScrollReveal delay={0}><div className="reality-card"><p className="reality-num" style={{color:'#4ea989'}}>69%</p><p className="reality-label">of conflicts are perpetual — they never fully resolve</p></div></ScrollReveal>
            <ScrollReveal delay={100}><div className="reality-card"><p className="reality-num" style={{color:'#92a6f4'}}>6 yrs</p><p className="reality-label">couples wait before seeking any help</p></div></ScrollReveal>
            <ScrollReveal delay={200}><div className="reality-card"><p className="reality-num" style={{color:'#f67700'}}>96%</p><p className="reality-label">of conversations are determined by how they start</p></div></ScrollReveal>
            <ScrollReveal delay={300}><div className="reality-card"><p className="reality-num" style={{color:'#bd57f2'}}>5:1</p><p className="reality-label">positive to negative — the magic ratio</p></div></ScrollReveal>

            {/* Marquee clones — visible only on mobile for the auto-scrolling carousel.
                Hidden on desktop via `.reality-card--clone { display: none; }` in globals.css. */}
            <div className="reality-card reality-card--clone" aria-hidden="true"><p className="reality-num" style={{color:'#4ea989'}}>69%</p><p className="reality-label">of conflicts are perpetual — they never fully resolve</p></div>
            <div className="reality-card reality-card--clone" aria-hidden="true"><p className="reality-num" style={{color:'#92a6f4'}}>6 yrs</p><p className="reality-label">couples wait before seeking any help</p></div>
            <div className="reality-card reality-card--clone" aria-hidden="true"><p className="reality-num" style={{color:'#f67700'}}>96%</p><p className="reality-label">of conversations are determined by how they start</p></div>
            <div className="reality-card reality-card--clone" aria-hidden="true"><p className="reality-num" style={{color:'#bd57f2'}}>5:1</p><p className="reality-label">positive to negative — the magic ratio</p></div>
          </div>
          <ScrollReveal delay={200}>
            <div className="reality-quote-wrap">
              <p className="reality-quote">&ldquo;Conflict in relationships is inevitable. It&apos;s not a sign that something is broken, it&apos;s a signal that something needs attention.&rdquo;</p>
              <p className="reality-cite">&mdash; Esther Perel</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Understand Better ── */}
      <section className="ub">
        <div className="ub-container">
          <div className="ub-left">
            <ScrollReveal>
              <p className="ub-eyebrow">UNDERSTAND BETTER</p>
              <h2 className="ub-title">Every person reacts differently. Understand how to navigate your differences.</h2>
              <p className="ub-body">
                Through short assessments, Hey Otis maps how you and your partner experience
                love, handle conflict, and respond to stress. Not to label you, but to help you
                understand why you react the way you do, and why they do too.
              </p>
            </ScrollReveal>
          </div>
          <div className="ub-right">
            <ScrollReveal delay={200}>
              <img src="/understand-image.png" alt="Growth screens" className="ub-image" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Grow Together ── */}
      <section className="gt">
        <div className="gt-container">
          <div className="gt-left">
            <ScrollReveal delay={200}>
              <img src="/grow-image.png" alt="Together screens" className="gt-image" />
            </ScrollReveal>
          </div>
          <div className="gt-right">
            <ScrollReveal>
              <p className="gt-eyebrow">GROW TOGETHER</p>
              <h2 className="gt-title">The more you share, the better Otis understands.</h2>
              <p className="gt-body">
                Every answer you and your partner give tells Otis something new about your relationship.
                Those insights help shape every conversation. So when you&apos;re stuck in the same argument again,
                it already knows what&apos;s really going on. And when you&apos;re ready to talk, it helps you find
                words that land, not words that wound.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <StepsSection />

      {/* ── Final CTA ── */}
      <section className="cta" id="get-started">
        <ScrollReveal>
          <h2 className="cta-title">Your next argument could be your next breakthrough.</h2>
          <p className="cta-sub">
            Join the waitlist and have healthier conversations.
          </p>
          <div className="cta-form">
            <WaitlistForm variant="cta" />
          </div>
        </ScrollReveal>
      </section>

      {/* ── Footer ── */}
      <footer className="ft">
        <p className="ft-brand">Hey Otis</p>
        <p className="ft-disc">Hey Otis supports but does not replace professional therapy.</p>
        <p className="ft-copy">&copy; 2026 Hey Otis. All rights reserved. &nbsp;|&nbsp; <a href="mailto:privacy@heyotis.app">privacy@heyotis.app</a></p>
      </footer>
    </main>
  );
}
