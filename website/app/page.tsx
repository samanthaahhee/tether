import StepsSection from './StepsSection';

export default function Home() {
  return (
    <main>
      {/* ── Nav ── */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <img src="/icon.png" alt="Hey Otis" className="nav-icon" />
            <span>Hey Otis</span>
          </div>
          <a href="#get-started" className="nav-cta">Get early access</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-quote fade-up">
              &ldquo;The quality of your relationships determines the quality of your life.&rdquo;
              <cite>&mdash; Esther Perel</cite>
            </p>
            <h1 className="fade-up delay-1">
              Every couple argues.<br />
              The ones that last<br />
              learn how to <em>repair</em>.
            </h1>
            <p className="hero-sub fade-up delay-2">
              Hey Otis is your private, AI-powered guide from rupture to repair.
              Process conflict, uncover what&apos;s really going on, and find the
              words that open doors.
            </p>
            <div className="hero-actions fade-up delay-3">
              <a href="#get-started" className="btn-primary">Get early access</a>
              <a href="#how" className="btn-ghost">See how it works</a>
            </div>
          </div>
          <div className="hero-phone fade-up delay-2">
            <div className="phone-frame">
              <img src="/session-vent.png" alt="Hey Otis session" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof Bar ── */}
      <section className="proof-bar">
        <div className="proof-inner">
          <div className="proof-item">
            <span className="proof-num">5</span>
            <span className="proof-label">Evidence-based frameworks</span>
          </div>
          <div className="proof-divider" />
          <div className="proof-item">
            <span className="proof-num">4</span>
            <span className="proof-label">Guided repair steps</span>
          </div>
          <div className="proof-divider" />
          <div className="proof-item">
            <span className="proof-num">100%</span>
            <span className="proof-label">Private &amp; secure</span>
          </div>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section className="problem-section">
        <div className="container">
          <div className="problem-header fade-up">
            <p className="eyebrow">The reality</p>
            <h2>Conflict isn&apos;t the problem.<br />Silence is.</h2>
            <p className="subtitle">
              Most couples don&apos;t break up because they fight. They break up because
              they stop trying to understand each other.
            </p>
          </div>

          <div className="stats-row">
            <div className="stat fade-up">
              <div className="stat-ring" style={{ '--ring-color': '#4ea989' } as React.CSSProperties}>
                <span>69%</span>
              </div>
              <p>of conflicts are perpetual &mdash; they never fully resolve</p>
            </div>
            <div className="stat fade-up delay-1">
              <div className="stat-ring" style={{ '--ring-color': '#92a6f4' } as React.CSSProperties}>
                <span>6 yrs</span>
              </div>
              <p>couples wait before seeking any help</p>
            </div>
            <div className="stat fade-up delay-2">
              <div className="stat-ring" style={{ '--ring-color': '#f67700' } as React.CSSProperties}>
                <span>96%</span>
              </div>
              <p>of the time, the first 3 minutes predict the outcome</p>
            </div>
            <div className="stat fade-up delay-3">
              <div className="stat-ring" style={{ '--ring-color': '#bd57f2' } as React.CSSProperties}>
                <span>5:1</span>
              </div>
              <p>positive to negative &mdash; the magic ratio for lasting love</p>
            </div>
          </div>

          <blockquote className="perel-quote fade-up">
            <p>
              &ldquo;Conflict in relationships is inevitable. It&apos;s not a sign that
              something is broken &mdash; it&apos;s a signal that something needs attention.&rdquo;
            </p>
            <cite>&mdash; Esther Perel</cite>
          </blockquote>
        </div>
      </section>

      {/* ── How It Works (Interactive) ── */}
      <StepsSection />

      {/* ── App Screenshots Showcase ── */}
      <section className="showcase-section">
        <div className="container">
          <div className="showcase-header fade-up">
            <p className="eyebrow">Inside the app</p>
            <h2>Your pocket relationship coach</h2>
            <p className="subtitle">
              Guided conversations, grounding tools, and personalised insights &mdash;
              all in one private space.
            </p>
          </div>

          <div className="showcase-scroll">
            <div className="showcase-card fade-up">
              <div className="phone-frame phone-sm">
                <img src="/session-vent.png" alt="Vent mode" />
              </div>
              <h4>Let it out safely</h4>
              <p>Private venting space with voice or text</p>
            </div>
            <div className="showcase-card fade-up delay-1">
              <div className="phone-frame phone-sm">
                <img src="/session-understand.png" alt="Understand mode" />
              </div>
              <h4>Uncover the pattern</h4>
              <p>AI-guided reflection to find root causes</p>
            </div>
            <div className="showcase-card fade-up delay-2">
              <div className="phone-frame phone-sm">
                <img src="/session-prepare.png" alt="Prepare mode" />
              </div>
              <h4>Find the right words</h4>
              <p>Frame your needs without blame</p>
            </div>
            <div className="showcase-card fade-up delay-3">
              <div className="phone-frame phone-sm">
                <img src="/tools.png" alt="Tools" />
              </div>
              <h4>Tools for tough moments</h4>
              <p>Breathing, grounding &amp; repair exercises</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Evidence-Based ── */}
      <section className="science-section">
        <div className="container">
          <div className="science-layout">
            <div className="science-text fade-up">
              <p className="eyebrow">Grounded in science</p>
              <h2>Five evidence-based frameworks. One app.</h2>
              <p className="subtitle">
                Hey Otis draws from decades of relationship research. Nothing is made up.
                Everything is backed by science.
              </p>
            </div>
            <div className="science-cards fade-up delay-1">
              <div className="science-card" style={{ borderLeftColor: '#96d35f' }}>
                <h4>Gottman Method</h4>
                <p>40+ years of research. Predicts relationship outcomes with 90% accuracy.</p>
              </div>
              <div className="science-card" style={{ borderLeftColor: '#92a6f4' }}>
                <h4>Emotionally Focused Therapy</h4>
                <p>Grounded in attachment theory and the science of adult bonding.</p>
              </div>
              <div className="science-card" style={{ borderLeftColor: '#f67700' }}>
                <h4>Non-Violent Communication</h4>
                <p>A structured approach to expressing needs without blame or judgment.</p>
              </div>
              <div className="science-card" style={{ borderLeftColor: '#bd57f2' }}>
                <h4>Internal Family Systems</h4>
                <p>Understand the protective parts that take over during conflict.</p>
              </div>
              <div className="science-card" style={{ borderLeftColor: '#e85d75' }}>
                <h4>Cognitive Behavioural Couples Therapy</h4>
                <p>Reframe automatic thoughts that fuel emotional reactions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="final-cta" id="get-started">
        <div className="container">
          <div className="cta-card fade-up">
            <img src="/mascot-home.png" alt="Otis mascot" className="cta-mascot" />
            <h2>Your next argument could be your next breakthrough.</h2>
            <p>
              No couples therapy waitlist. No awkward first sessions.
              Just you, your feelings, and a path forward.
            </p>
            <a href="#" className="btn-primary btn-lg">Get early access</a>
            <p className="cta-note">Free to start. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="/icon.png" alt="Hey Otis" className="footer-icon" />
            <span>Hey Otis</span>
          </div>
          <p className="footer-disclaimer">
            Hey Otis supports but does not replace professional therapy.
          </p>
          <div className="footer-links">
            <a href="mailto:privacy@heyotis.app">Privacy</a>
            <span>&middot;</span>
            <a href="mailto:privacy@heyotis.app">Contact</a>
          </div>
          <p className="footer-copy">&copy; 2026 Hey Otis. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
