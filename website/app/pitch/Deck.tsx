'use client';

import { useEffect, useState, useCallback, ReactNode } from 'react';

type Slide = { id: string; bg?: string; render: () => ReactNode };

const STEP_COLORS = {
  teal: '#4ea989',
  peri: '#92a6f4',
  orange: '#f67700',
  purple: '#bd57f2',
  green: '#4a7a23',
  lime: '#96d35f',
  limeLight: '#c8ecb0',
  cream: '#f7f5fd',
  ink: '#211e28',
  sub: '#80798c',
  body: '#3a3630',
};

const SLIDES: Slide[] = [
  // ── 01 · COVER ──
  {
    id: 'cover',
    bg: `radial-gradient(120% 80% at 20% 0%, ${STEP_COLORS.limeLight} 0%, ${STEP_COLORS.lime} 100%)`,
    render: () => (
      <div className="pk-frame pk-frame--cover">
        <div className="pk-cover-mark">
          <img src="/header-logo.png" alt="Hey Otis" />
        </div>
        <h1 className="pk-cover-title">From rupture to repair.</h1>
        <p className="pk-cover-sub">A private AI guide for couples in conflict.</p>
        <div className="pk-cover-meta">
          Samantha Ahhee&nbsp;&nbsp;·&nbsp;&nbsp;Founder, Hey Otis&nbsp;&nbsp;·&nbsp;&nbsp;Amsterdam&nbsp;&nbsp;·&nbsp;&nbsp;2026
        </div>
      </div>
    ),
  },

  // ── 02 · PROBLEM ──
  {
    id: 'problem',
    render: () => (
      <div className="pk-frame">
        <p className="pk-eyebrow">THE PROBLEM</p>
        <h2 className="pk-h">Conflict isn&apos;t the problem. Silence is.</h2>
        <div className="pk-prose">
          <p><strong>69%</strong> of relationship conflicts never fully resolve.</p>
          <p>Couples wait <strong>six years</strong> before seeking help.</p>
          <p>Most fights happen at <strong>11pm</strong>, nine days from the next therapy session, if there is one.</p>
        </div>
        <p className="pk-foot">
          When my own relationship hit that wall, I had nothing to reach for that
          wasn&apos;t a self-help book or a 3am text to a friend.
        </p>
      </div>
    ),
  },

  // ── 03 · WHY NOW ──
  {
    id: 'why-now',
    bg: STEP_COLORS.cream,
    render: () => (
      <div className="pk-frame">
        <p className="pk-eyebrow">WHY NOW</p>
        <h2 className="pk-h">Three things shifted in the last 24 months.</h2>
        <div className="pk-three">
          <ThreeRow
            n="01"
            title="Models are ready."
            body="LLMs crossed the threshold for emotional nuance without giving harmful advice."
          />
          <ThreeRow
            n="02"
            title="Regulation is here."
            body="The EU AI Act gives us a clear frame to build trustworthy mental-health AI on."
          />
          <ThreeRow
            n="03"
            title="Demand broke open."
            body="Dutch GGZ relatietherapie waitlists hit 6+ months. The gap is now structural."
          />
        </div>
      </div>
    ),
  },

  // ── 04 · PRODUCT ──
  {
    id: 'product',
    render: () => (
      <div className="pk-frame pk-frame--split">
        <div className="pk-split-text">
          <p className="pk-eyebrow">THE PRODUCT</p>
          <h2 className="pk-h">A private space to use during conflict.</h2>
          <ul className="pk-bullets">
            <li>Open it after a fight. Walk through four steps. Arrive at a conversation.</li>
            <li>Solo or synced with your partner. Voice or text input.</li>
            <li>End-to-end private. We never train on user data. GDPR-native.</li>
            <li>Available on iOS, Android, and web.</li>
          </ul>
        </div>
        <div className="pk-split-image">
          <img src="/hero-image.png" alt="Hey Otis app" />
        </div>
      </div>
    ),
  },

  // ── 05 · HOW IT WORKS ──
  {
    id: 'how',
    bg: STEP_COLORS.cream,
    render: () => (
      <div className="pk-frame">
        <p className="pk-eyebrow">HOW IT WORKS</p>
        <h2 className="pk-h">Four steps. One conversation at a time.</h2>
        <div className="pk-steps">
          <StepCard num={1} color={STEP_COLORS.teal} name="Vent" body="Say what you&apos;re feeling. Privately." />
          <StepCard num={2} color={STEP_COLORS.peri} name="Understand" body="Find the unmet need underneath." />
          <StepCard num={3} color={STEP_COLORS.orange} name="Prepare" body="Frame what you want to say." />
          <StepCard num={4} color={STEP_COLORS.purple} name="Nurture" body="Walk through the actual repair." />
        </div>
        <p className="pk-foot">
          Each step maps to peer-reviewed research: emotion regulation, attachment, NVC, Gottman softened start-up.
        </p>
      </div>
    ),
  },

  // ── 06 · WEDGE & DEFENSIBILITY ──
  {
    id: 'wedge',
    render: () => (
      <div className="pk-frame">
        <p className="pk-eyebrow">WEDGE &amp; DEFENSIBILITY</p>
        <h2 className="pk-h">Why ChatGPT won&apos;t eat this. Why BetterHelp can&apos;t.</h2>
        <div className="pk-three-cards">
          <ThreeCard title="Frameworks library" body="Validated by clinical advisor. 18 months to build, hard to clone." />
          <ThreeCard title="Memory flywheel" body="Each session compounds. Generic chatbots forget you between chats." />
          <ThreeCard title="Brand trust" body="EU-native, private by default. The category punishes any breach." />
        </div>
        <p className="pk-foot">
          We are explicitly not a medical device. The clinical advisor on the team validates that boundary monthly.
        </p>
      </div>
    ),
  },

  // ── 07 · MARKET ──
  {
    id: 'market',
    bg: STEP_COLORS.cream,
    render: () => (
      <div className="pk-frame">
        <p className="pk-eyebrow">THE MARKET</p>
        <h2 className="pk-h">European-first. Bottoms-up.</h2>
        <div className="pk-market">
          <MarketRow size="47M" label="long-term couples in the EU" />
          <MarketRow size="38M" label="are not in any form of therapy" />
          <MarketRow size="0.5%" label="= 190k subs in 5 years × €15/mo = €34M ARR" highlight />
        </div>
        <p className="pk-foot">
          Comparables: Replika · Paired UK · Headspace.
          <br />
          We start in NL + UK + DACH. US is Year 3, not Year 1.
        </p>
      </div>
    ),
  },

  // ── 08 · BUSINESS MODEL ──
  {
    id: 'model',
    render: () => (
      <div className="pk-frame">
        <p className="pk-eyebrow">BUSINESS MODEL</p>
        <h2 className="pk-h">Subscription. Couple-tier is the unlock.</h2>
        <div className="pk-prices">
          <PriceCard tier="Free" price="€0" body="One guided repair per month, basic insights" />
          <PriceCard tier="Plus (solo)" price="€14.99/mo" body="Unlimited repairs, partner sync, full assessment library" featured />
          <PriceCard tier="Couples (both)" price="€22/mo" body="Both partners synced, shared history, deeper insight" />
        </div>
        <p className="pk-foot">
          <strong>Blended CAC €18 · 14-month tenure · 78% gross margin · LTV €185.</strong>
          <br />
          Couple subscription = built-in viral loop. One signup brings two users.
        </p>
      </div>
    ),
  },

  // ── 09 · GTM ──
  {
    id: 'gtm',
    bg: STEP_COLORS.cream,
    render: () => (
      <div className="pk-frame">
        <p className="pk-eyebrow">YEAR 1 GTM</p>
        <h2 className="pk-h">Three channels. Honest CPA targets.</h2>
        <div className="pk-channels">
          <ChannelRow title="Reddit + Substack organic" body="Relationship subs, attachment-style writers. Already running." cpa="€4" />
          <ChannelRow title="Couples-therapist referrals" body="Clinicians give Hey Otis to clients between sessions." cpa="€8" />
          <ChannelRow title="Instagram Reels + creators" body="Short-form clinical-content partnerships. Brand-driven." cpa="€25" />
        </div>
        <p className="pk-foot">
          Channel 1 already validated by the heyotis.app/research survey campaign.
        </p>
      </div>
    ),
  },

  // ── 10 · TRACTION ──
  {
    id: 'traction',
    render: () => (
      <div className="pk-frame">
        <p className="pk-eyebrow">TRACTION</p>
        <h2 className="pk-h">Where we are today.</h2>
        <div className="pk-bigstats">
          <BigStat n="[X]" label="Waitlist signups" sub="heyotis.app, organic" />
          <BigStat n="[X]" label="Survey responses" sub="primary research, real couples" />
          <BigStat n="78%" label="Said they&apos;d try it" sub="from in-survey validation" />
        </div>
        <p className="pk-foot">
          Brand, marketing site, Supabase backend, payments, app prototype, all live.
          <br />
          Beta launching Q3 2026 in EN-speaking markets. Apple + Google submission ready.
        </p>
      </div>
    ),
  },

  // ── 11 · TEAM ──
  {
    id: 'team',
    bg: STEP_COLORS.cream,
    render: () => (
      <div className="pk-frame">
        <p className="pk-eyebrow">TEAM</p>
        <h2 className="pk-h">Two founders. Lived experience + commercial pedigree.</h2>
        <div className="pk-team">
          <Member
            name="Samantha Ahhee"
            role="Founder + CEO"
            body="Designer + builder. Previously [your prior role]. Built the Hey Otis product, brand, and primary-research system end-to-end. Lives the problem."
          />
          <Member
            name="[Husband&rsquo;s name]"
            role="Co-founder + GTM"
            body="[N] years bringing software products to market. Previously [his prior role]. Owns commercial strategy, partnerships, and scale."
          />
          <Member
            name="Hiring next"
            role="Clinical lead"
            body="Licensed couples therapist to validate frameworks, prompts, safety guardrails. In conversation with two candidates."
          />
        </div>
      </div>
    ),
  },

  // ── 12 · ASK ──
  {
    id: 'ask',
    bg: `radial-gradient(120% 80% at 20% 0%, ${STEP_COLORS.limeLight} 0%, ${STEP_COLORS.lime} 100%)`,
    render: () => (
      <div className="pk-frame pk-frame--center">
        <p className="pk-eyebrow" style={{ color: STEP_COLORS.green }}>THE ASK</p>
        <h2 className="pk-h pk-h--xl">Raising [€XXX]K pre-seed</h2>
        <p className="pk-lead">
          24-month runway. To launch publicly, hit 10,000 paying users,
          <br />
          validate Couples-tier LTV, and reach Seed milestones.
        </p>
        <p className="pk-non-dilutive">
          Plan to stack with WBSO R&amp;D credit + RVO Innovation Credit
          <br />
          (targeting +6 months runway non-dilutively)
        </p>
        <div className="pk-cta">
          <a href="mailto:samantha.ahhee@gmail.com" className="pk-btn">samantha.ahhee@gmail.com</a>
          <a href="https://heyotis.app" className="pk-btn pk-btn--ghost">heyotis.app</a>
        </div>
      </div>
    ),
  },
];

export default function Deck() {
  const [i, setI] = useState(0);
  const [direction, setDirection] = useState<'fwd' | 'back'>('fwd');

  const go = useCallback((next: number, dir: 'fwd' | 'back' = 'fwd') => {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, next));
    setDirection(dir);
    setI(clamped);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${clamped + 1}`);
    }
  }, []);

  // Sync with URL hash
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fromHash = () => {
      const n = parseInt(window.location.hash.replace('#', ''), 10);
      if (!isNaN(n) && n >= 1 && n <= SLIDES.length) setI(n - 1);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'j') { e.preventDefault(); go(i + 1, 'fwd'); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'k') { e.preventDefault(); go(i - 1, 'back'); }
      else if (e.key === 'Home') { e.preventDefault(); go(0); }
      else if (e.key === 'End') { e.preventDefault(); go(SLIDES.length - 1); }
      else if (e.key === 'f') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [i, go]);

  const s = SLIDES[i];

  return (
    <main className="pk-stage" style={{ background: s.bg ?? '#fff' }}>
      {/* Click zones */}
      <button className="pk-zone pk-zone--prev" aria-label="Previous slide" onClick={() => go(i - 1, 'back')} />
      <button className="pk-zone pk-zone--next" aria-label="Next slide" onClick={() => go(i + 1, 'fwd')} />

      <div key={`${s.id}-${direction}`} className={`pk-stage-inner pk-anim-${direction}`}>
        {s.render()}
      </div>

      {/* Floating chrome */}
      <div className="pk-controls">
        <button className="pk-btn-icon" onClick={() => go(i - 1, 'back')} disabled={i === 0} aria-label="Previous">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span className="pk-counter">{String(i + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}</span>
        <button className="pk-btn-icon" onClick={() => go(i + 1, 'fwd')} disabled={i === SLIDES.length - 1} aria-label="Next">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      <div className="pk-help" aria-hidden="true">← → arrows · F for fullscreen</div>

      <div className="pk-progress">
        <div className="pk-progress-fill" style={{ width: `${((i + 1) / SLIDES.length) * 100}%` }} />
      </div>
    </main>
  );
}

// ── Sub-components ──

function StepCard({ num, color, name, body }: { num: number; color: string; name: string; body: string }) {
  return (
    <div className="pk-step">
      <span className="pk-step-num" style={{ background: color }}>{num}</span>
      <h3 className="pk-step-name">{name}</h3>
      <p className="pk-step-body">{body}</p>
    </div>
  );
}

function ThreeRow({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="pk-three-row">
      <span className="pk-three-num">{n}</span>
      <div>
        <h3 className="pk-three-title">{title}</h3>
        <p className="pk-three-body">{body}</p>
      </div>
    </div>
  );
}

function ThreeCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="pk-card">
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

function MarketRow({ size, label, highlight }: { size: string; label: string; highlight?: boolean }) {
  return (
    <div className={`pk-market-row ${highlight ? 'pk-market-row--hi' : ''}`}>
      <span className="pk-market-size">{size}</span>
      <span className="pk-market-label">{label}</span>
    </div>
  );
}

function PriceCard({ tier, price, body, featured }: { tier: string; price: string; body: string; featured?: boolean }) {
  return (
    <div className={`pk-price ${featured ? 'pk-price--feat' : ''}`}>
      <p className="pk-price-tier">{tier}</p>
      <p className="pk-price-amt">{price}</p>
      <p className="pk-price-body">{body}</p>
    </div>
  );
}

function ChannelRow({ title, body, cpa }: { title: string; body: string; cpa: string }) {
  return (
    <div className="pk-channel">
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
      <span className="pk-cpa">CPA target {cpa}</span>
    </div>
  );
}

function BigStat({ n, label, sub }: { n: string; label: string; sub: string }) {
  return (
    <div className="pk-bigstat">
      <p className="pk-bigstat-n">{n}</p>
      <p className="pk-bigstat-l">{label}</p>
      <p className="pk-bigstat-s">{sub}</p>
    </div>
  );
}

function Member({ name, role, body }: { name: string; role: string; body: string }) {
  return (
    <div className="pk-member">
      <p className="pk-member-name" dangerouslySetInnerHTML={{ __html: name }} />
      <p className="pk-member-role">{role}</p>
      <p className="pk-member-body">{body}</p>
    </div>
  );
}
