'use client';

import { ReactNode } from 'react';

type Section = { id: string; bg?: string; render: () => ReactNode };

const SECTIONS: Section[] = [
  // ── COVER ──
  {
    id: 'cover',
    bg: 'linear-gradient(180deg, #c8ecb0 0%, #9ada5e 100%)',
    render: () => (
      <div className="pd-section pd-cover">
        <img src="/header-logo.png" alt="Hey Otis" className="pd-cover-logo" />
        <h1 className="pd-cover-title">From rupture to repair.</h1>
        <p className="pd-cover-sub">A private guide for couples in conflict.</p>
        <div className="pd-cover-meta">
          <span>Samantha Ahhee</span>
          <span className="pd-dot">·</span>
          <span>Founder, Hey Otis</span>
          <span className="pd-dot">·</span>
          <span>Amsterdam, 2026</span>
        </div>
      </div>
    ),
  },

  // ── HOOK ──
  {
    id: 'hook',
    render: () => (
      <div className="pd-section pd-center">
        <p className="pd-eyebrow">THE HOOK</p>
        <h2 className="pd-h">
          Every couple argues.<br />
          The ones that last learn how to repair.
        </h2>
        <p className="pd-quote">
          &ldquo;Conflict in relationships is inevitable. It&apos;s not a sign that something is broken,
          it&apos;s a signal that something needs attention.&rdquo;
        </p>
        <p className="pd-quote-cite">— Esther Perel</p>
      </div>
    ),
  },

  // ── PROBLEM ──
  {
    id: 'problem',
    bg: '#f7f5fd',
    render: () => (
      <div className="pd-section pd-stack">
        <p className="pd-eyebrow">THE PROBLEM</p>
        <h2 className="pd-h">Conflict isn&apos;t the problem. Silence is.</h2>
        <div className="pd-stat-grid">
          <Stat n="69%" color="#4ea989" label="of conflicts are perpetual, they never fully resolve" />
          <Stat n="6 yrs" color="#92a6f4" label="couples wait before seeking any help" />
          <Stat n="96%" color="#f67700" label="of conversations are determined by how they start" />
          <Stat n="5:1" color="#bd57f2" label="positive to negative, the magic ratio" />
        </div>
        <p className="pd-foot">
          Most couples don&apos;t break up because they fight. They break up because they
          stop trying to understand each other.
        </p>
      </div>
    ),
  },

  // ── WHY NOW ──
  {
    id: 'why-now',
    render: () => (
      <div className="pd-section pd-stack">
        <p className="pd-eyebrow">WHY NOW</p>
        <h2 className="pd-h">Therapy works. But most fights happen between sessions.</h2>
        <div className="pd-row3">
          <Card title="Therapy is expensive" body="$150 to $300 per session in most major cities. Most couples can&apos;t sustain weekly." />
          <Card title="Waitlists are months long" body="Couples in crisis wait 6 to 12 weeks for an opening. The fights don&apos;t wait." />
          <Card title="The damage is between sessions" body="Most ruptures happen at 11pm on a Tuesday, nine days from the next appointment." />
        </div>
        <p className="pd-foot">
          AI has finally crossed the threshold to help people process emotion safely,
          privately, and in real time. The window to build this is open.
        </p>
      </div>
    ),
  },

  // ── SOLUTION ──
  {
    id: 'solution',
    bg: 'linear-gradient(180deg, #f7f5fd 0%, #c8ecb0 100%)',
    render: () => (
      <div className="pd-section pd-center">
        <p className="pd-eyebrow">THE SOLUTION</p>
        <h2 className="pd-h pd-h--lg">
          Hey Otis is a private guide that walks couples<br />
          from rupture to repair.
        </h2>
        <p className="pd-lead">
          In your pocket. At 11pm. When your therapist doesn&apos;t pick up.<br />
          Not a replacement for therapy. The thing that makes therapy work.
        </p>
      </div>
    ),
  },

  // ── HOW IT WORKS ──
  {
    id: 'how',
    bg: '#f7f5fd',
    render: () => (
      <div className="pd-section pd-stack">
        <p className="pd-eyebrow">HOW IT WORKS</p>
        <h2 className="pd-h">Four steps. One conversation at a time.</h2>
        <div className="pd-steps">
          <Step num={1} color="#4ea989" name="Vent" sub="Let it all out" body="A private space to say exactly what you&apos;re feeling. No one else sees this. Putting emotion into words reduces its intensity." />
          <Step num={2} color="#92a6f4" name="Understand" sub="What&apos;s really going on?" body="Most arguments aren&apos;t about what they seem. Hey Otis helps you find the unmet need underneath." />
          <Step num={3} color="#f67700" name="Prepare" sub="Find the right words" body="Coaches you to frame what you want to say, so your partner hears you, not an attack." />
          <Step num={4} color="#bd57f2" name="Nurture" sub="Have the conversation" body="Step by step support during the actual repair. How to open softly, what to say if it gets heated." />
        </div>
      </div>
    ),
  },

  // ── PRODUCT ──
  {
    id: 'product',
    render: () => (
      <div className="pd-section pd-split">
        <div className="pd-split-left">
          <p className="pd-eyebrow">THE PRODUCT</p>
          <h2 className="pd-h">A relationship that learns the more you share.</h2>
          <ul className="pd-list">
            <li>Short assessments map how each partner experiences love, conflict, and stress</li>
            <li>Voice or text input. Use it solo or together</li>
            <li>End to end private. We never train models on your data. We never sell it.</li>
            <li>Available 24/7 on iOS, Android, and web</li>
          </ul>
        </div>
        <div className="pd-split-right">
          <img src="/hero-image.png" alt="Hey Otis app" className="pd-product-img" />
        </div>
      </div>
    ),
  },

  // ── FRAMEWORKS ──
  {
    id: 'frameworks',
    bg: 'linear-gradient(180deg, #f7f5fd 0%, #c5cffa 100%)',
    render: () => (
      <div className="pd-section pd-stack">
        <p className="pd-eyebrow">EVIDENCE BASED</p>
        <h2 className="pd-h">Built on the same frameworks couples therapists use.</h2>
        <div className="pd-row5">
          <Pill title="Gottman" sub="Conflict styles + sound relationship house" />
          <Pill title="Attachment Theory" sub="Anxious / avoidant / secure" />
          <Pill title="NVC" sub="Observation, feeling, need, request" />
          <Pill title="Love Languages" sub="How each partner gives + receives" />
          <Pill title="IFS" sub="Parts work for self understanding" />
        </div>
        <p className="pd-foot">
          Otis is not making it up. Every prompt, every reframe, every step is grounded in
          peer reviewed couples research.
        </p>
      </div>
    ),
  },

  // ── MARKET ──
  {
    id: 'market',
    render: () => (
      <div className="pd-section pd-stack">
        <p className="pd-eyebrow">THE MARKET</p>
        <h2 className="pd-h">A massive, underserved category.</h2>
        <div className="pd-market">
          <MarketRow size="$1.2T" label="TAM" body="Global wellness market (Global Wellness Institute, 2024)" />
          <MarketRow size="$58B" label="SAM" body="Mental health + relationship wellness, growing 17% YoY" />
          <MarketRow size="$4B" label="SOM (Year 5)" body="English speaking couples 25 to 55 willing to pay for ongoing relationship support" />
        </div>
        <p className="pd-foot">
          47M couples in the US alone are in long term relationships and not in therapy.
          We&apos;re not stealing share from BetterHelp. We&apos;re creating a new category.
        </p>
      </div>
    ),
  },

  // ── BUSINESS MODEL ──
  {
    id: 'model',
    bg: '#f7f5fd',
    render: () => (
      <div className="pd-section pd-stack">
        <p className="pd-eyebrow">BUSINESS MODEL</p>
        <h2 className="pd-h">Subscription. Aligned with the long term work of a relationship.</h2>
        <div className="pd-row3">
          <PriceCard tier="Free" price="$0" body="Daily check ins, one guided repair per month, basic insights" />
          <PriceCard tier="Hey Otis Plus" price="$14.99/mo" body="Unlimited repairs, partner sync, full assessment library" featured />
          <PriceCard tier="Couples (both)" price="$22/mo" body="Both partners synced, shared history, deeper insight" />
        </div>
        <p className="pd-foot">
          Therapy is $200 a session. Hey Otis is less than two coffees a week, available the moment you need it.
        </p>
      </div>
    ),
  },

  // ── TRACTION ──
  {
    id: 'traction',
    render: () => (
      <div className="pd-section pd-stack">
        <p className="pd-eyebrow">TRACTION</p>
        <h2 className="pd-h">Where we are today.</h2>
        <div className="pd-row3">
          <BigStat n="[X]" label="waitlist signups" sub="from heyotis.app + organic Reddit + IG" />
          <BigStat n="[X]" label="survey responses" sub="primary research from real couples" />
          <BigStat n="78%" label="said they&apos;d try it" sub="from in survey product validation" />
        </div>
        <p className="pd-foot">
          Beta launching Q3 2026 in EN speaking markets. Apple + Google submission ready. Brand
          identity, marketing site, and waitlist infrastructure all live.
        </p>
      </div>
    ),
  },

  // ── TEAM ──
  {
    id: 'team',
    bg: '#f7f5fd',
    render: () => (
      <div className="pd-section pd-stack">
        <p className="pd-eyebrow">TEAM</p>
        <h2 className="pd-h">Built by people who&apos;ve lived this.</h2>
        <div className="pd-team">
          <Member name="Samantha Ahhee" role="Founder + CEO" body="Designer + builder. Previously [your prior role]. Built Hey Otis after experiencing first hand what was missing between therapy and the everyday." />
          <Member name="[Add advisor name]" role="Clinical Advisor" body="Licensed couples therapist. Validates the frameworks, the prompts, the safety guardrails." />
          <Member name="[Add advisor name]" role="Technical Advisor" body="ML / AI background. Helps shape the model layer + private architecture." />
        </div>
      </div>
    ),
  },

  // ── ASK ──
  {
    id: 'ask',
    bg: 'linear-gradient(180deg, #c8ecb0 0%, #9ada5e 100%)',
    render: () => (
      <div className="pd-section pd-center">
        <p className="pd-eyebrow">THE ASK</p>
        <h2 className="pd-h pd-h--lg">
          Raising <span className="pd-amount">[€XXX]K</span> pre seed
        </h2>
        <p className="pd-lead">
          To launch publicly, hit 10,000 paying users in 18 months,<br />
          and prove that couples will pay to learn how to repair.
        </p>
        <div className="pd-cta">
          <a href="mailto:samantha.ahhee@gmail.com" className="pd-btn">samantha.ahhee@gmail.com</a>
          <a href="https://heyotis.app" className="pd-btn pd-btn--ghost">heyotis.app</a>
        </div>
      </div>
    ),
  },
];

export default function Deck() {
  return (
    <main className="pd-page">
      {/* Tiny top nav so investors can get back to the marketing site */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <a href="/"><img src="/header-logo.png" alt="Hey Otis" className="nav-icon" /></a>
          </div>
          <a href="mailto:samantha.ahhee@gmail.com" className="nav-cta">Get in touch</a>
        </div>
      </nav>

      {SECTIONS.map((s) => (
        <section
          key={s.id}
          id={s.id}
          className="pd-block"
          style={{ background: s.bg ?? '#fff' }}
        >
          <div className="pd-block-inner">{s.render()}</div>
        </section>
      ))}

      <footer className="ft">
        <p className="ft-brand">Hey Otis</p>
        <p className="ft-disc">Hey Otis supports but does not replace professional therapy.</p>
        <p className="ft-copy">&copy; 2026 Hey Otis. &nbsp;|&nbsp; <a href="mailto:samantha.ahhee@gmail.com">samantha.ahhee@gmail.com</a></p>
      </footer>
    </main>
  );
}

function Stat({ n, color, label }: { n: string; color: string; label: string }) {
  return (
    <div className="pd-stat">
      <p className="pd-stat-n" style={{ color }}>{n}</p>
      <p className="pd-stat-l">{label}</p>
    </div>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="pd-card">
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

function Step({ num, color, name, sub, body }: { num: number; color: string; name: string; sub: string; body: string }) {
  return (
    <div className="pd-step">
      <div className="pd-step-head">
        <span className="pd-step-num" style={{ background: color }}>{num}</span>
        <div>
          <p className="pd-step-name">{name}</p>
          <p className="pd-step-sub">{sub}</p>
        </div>
      </div>
      <p className="pd-step-body">{body}</p>
    </div>
  );
}

function Pill({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="pd-pill">
      <p className="pd-pill-t">{title}</p>
      <p className="pd-pill-s">{sub}</p>
    </div>
  );
}

function MarketRow({ size, label, body }: { size: string; label: string; body: string }) {
  return (
    <div className="pd-market-row">
      <p className="pd-market-size">{size}</p>
      <div>
        <p className="pd-market-label">{label}</p>
        <p className="pd-market-body">{body}</p>
      </div>
    </div>
  );
}

function PriceCard({ tier, price, body, featured }: { tier: string; price: string; body: string; featured?: boolean }) {
  return (
    <div className={`pd-price ${featured ? 'pd-price--feat' : ''}`}>
      <p className="pd-price-tier">{tier}</p>
      <p className="pd-price-amt">{price}</p>
      <p className="pd-price-body">{body}</p>
    </div>
  );
}

function BigStat({ n, label, sub }: { n: string; label: string; sub: string }) {
  return (
    <div className="pd-bigstat">
      <p className="pd-bigstat-n">{n}</p>
      <p className="pd-bigstat-l">{label}</p>
      <p className="pd-bigstat-s">{sub}</p>
    </div>
  );
}

function Member({ name, role, body }: { name: string; role: string; body: string }) {
  return (
    <div className="pd-member">
      <p className="pd-member-name">{name}</p>
      <p className="pd-member-role">{role}</p>
      <p className="pd-member-body">{body}</p>
    </div>
  );
}
