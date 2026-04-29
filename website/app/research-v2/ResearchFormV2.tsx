'use client';

import { useMemo, useState, FormEvent } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

type Status = 'idle' | 'sending' | 'success' | 'error';
type Choice = { value: string; label: string };

// ── Choice sets ─────────────────────────────────────────────────────────

const REL_LENGTH: Choice[] = [
  { value: 'lt_1', label: 'Less than 1 year' },
  { value: '1_3', label: '1 to 3 years' },
  { value: '3_7', label: '3 to 7 years' },
  { value: '7_plus', label: '7+ years' },
  { value: 'single', label: 'Single right now' },
];

const FREQUENCY: Choice[] = [
  { value: 'weekly', label: 'Weekly or more' },
  { value: 'monthly', label: 'A few times a month' },
  { value: 'few_times_year', label: 'A few times a year' },
  { value: 'rarely', label: 'Rarely' },
];

const FIRST_30: Choice[] = [
  { value: 'shut_down', label: 'Shut down or went quiet' },
  { value: 'vented_friend', label: 'Vented to a friend or family' },
  { value: 'googled', label: 'Googled or read articles' },
  { value: 'journaled', label: 'Journaled or wrote it out' },
  { value: 'talked_partner', label: 'Talked it through with my partner' },
  { value: 'slept', label: 'Slept on it / waited it out' },
  { value: 'used_ai', label: 'Used ChatGPT or another AI' },
  { value: 'other', label: 'Something else' },
];

const RESOLVED: Choice[] = [
  { value: 'yes', label: 'Yes, fully' },
  { value: 'partially', label: 'Partially' },
  { value: 'no', label: 'No, it just got dropped' },
];

const TOOLS: Choice[] = [
  { value: 'therapy', label: 'Couples or individual therapy' },
  { value: 'self_help', label: 'Self-help books' },
  { value: 'workbooks', label: 'Workbooks or worksheets' },
  { value: 'apps', label: 'Relationship apps' },
  { value: 'ai_chat', label: 'ChatGPT / Claude / other AI' },
  { value: 'podcasts', label: 'Podcasts' },
  { value: 'social', label: 'Social media (IG / TikTok therapists)' },
  { value: 'friends', label: 'Friends or family' },
  { value: 'nothing', label: 'Nothing, honestly' },
];

const STEPS: Choice[] = [
  { value: 'vent', label: 'Vent — a private space to process' },
  { value: 'understand', label: 'Understand — find what is really going on' },
  { value: 'prepare', label: 'Prepare — find the right words' },
  { value: 'nurture', label: 'Nurture — guide the actual conversation' },
];

const MODE: Choice[] = [
  { value: 'solo', label: 'Just for me' },
  { value: 'partner', label: 'For my partner too' },
  { value: 'both', label: 'Both of us, synced' },
];

// CSI-4 scale options (Funk & Rogge, 2007)
const CSI_HAPPINESS: Choice[] = [
  { value: '0', label: 'Extremely unhappy' },
  { value: '1', label: 'Fairly unhappy' },
  { value: '2', label: 'A little unhappy' },
  { value: '3', label: 'Happy' },
  { value: '4', label: 'Very happy' },
  { value: '5', label: 'Extremely happy' },
  { value: '6', label: 'Perfect' },
];

const CSI_GOING_WELL: Choice[] = [
  { value: '1', label: 'Not at all' },
  { value: '2', label: 'A little' },
  { value: '3', label: 'Sometimes' },
  { value: '4', label: 'Often' },
  { value: '5', label: 'All the time' },
];

const CSI_TRUE: Choice[] = [
  { value: '1', label: 'Not at all true' },
  { value: '2', label: 'A little true' },
  { value: '3', label: 'Somewhat true' },
  { value: '4', label: 'Mostly true' },
  { value: '5', label: 'Completely true' },
];

const APPEAL: Choice[] = [
  { value: '1', label: 'Not at all' },
  { value: '2', label: 'A little' },
  { value: '3', label: 'Somewhat' },
  { value: '4', label: 'Very' },
  { value: '5', label: 'Extremely' },
];

// ── Answer state ────────────────────────────────────────────────────────

type Answers = {
  in_long_term_relationship: string;
  recent_unresolved: string;
  conflict_frequency: string;
  relationship_length: string;
  // Behavioural
  last_conflict_about: string;
  first_30_min_actions: string[];
  did_resolve: string;
  tools_reached_for: string[];
  // CSI-4
  csi_happiness: string;
  csi_going_well: string;
  csi_strong: string;
  csi_warm: string;
  // Concept
  concept_appeal: string;
  maxdiff_best: string;
  maxdiff_worst: string;
  usage_blockers: string;
  mode_preference: string;
  // Pricing (Van Westendorp)
  vw_too_cheap: string;
  vw_bargain: string;
  vw_expensive: string;
  vw_too_expensive: string;
  // Open
  open_wish: string;
  // Email
  email: string;
  wants_early_access: boolean;
};

const EMPTY: Answers = {
  in_long_term_relationship: '',
  recent_unresolved: '',
  conflict_frequency: '',
  relationship_length: '',
  last_conflict_about: '',
  first_30_min_actions: [],
  did_resolve: '',
  tools_reached_for: [],
  csi_happiness: '',
  csi_going_well: '',
  csi_strong: '',
  csi_warm: '',
  concept_appeal: '',
  maxdiff_best: '',
  maxdiff_worst: '',
  usage_blockers: '',
  mode_preference: '',
  vw_too_cheap: '',
  vw_bargain: '',
  vw_expensive: '',
  vw_too_expensive: '',
  open_wish: '',
  email: '',
  wants_early_access: false,
};

const REQUIRED_KEYS: (keyof Answers)[] = [
  'in_long_term_relationship',
  'recent_unresolved',
  'conflict_frequency',
  'relationship_length',
  'first_30_min_actions',
  'did_resolve',
  'tools_reached_for',
  'csi_happiness',
  'csi_going_well',
  'csi_strong',
  'csi_warm',
  'concept_appeal',
  'maxdiff_best',
  'maxdiff_worst',
  'mode_preference',
];

function isFilled(v: string | string[]) {
  return Array.isArray(v) ? v.length > 0 : v.length > 0;
}

function parsePrice(s: string): number | null {
  if (!s.trim()) return null;
  const cleaned = s.replace(/[^\d.,]/g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

// ── Component ───────────────────────────────────────────────────────────

export default function ResearchFormV2() {
  const [a, setA] = useState<Answers>(EMPTY);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const progress = useMemo(() => {
    const filled = REQUIRED_KEYS.filter((k) => isFilled(a[k] as string | string[])).length;
    return Math.round((filled / REQUIRED_KEYS.length) * 100);
  }, [a]);

  function set<K extends keyof Answers>(key: K, value: Answers[K]) {
    setA((prev) => ({ ...prev, [key]: value }));
  }

  function toggleMulti<K extends 'first_30_min_actions' | 'tools_reached_for'>(key: K, value: string) {
    setA((prev) => {
      const arr = prev[key];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const missing = REQUIRED_KEYS.filter((k) => !isFilled(a[k] as string | string[]));
    if (missing.length) {
      setStatus('error');
      setMessage(`Please answer the ${missing.length} remaining ${missing.length === 1 ? 'question' : 'questions'}.`);
      const firstEl = document.querySelector(`[data-q="${missing[0]}"]`);
      firstEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // MaxDiff sanity check: best and worst must differ
    if (a.maxdiff_best && a.maxdiff_worst && a.maxdiff_best === a.maxdiff_worst) {
      setStatus('error');
      setMessage('Best and least-helpful step should be different.');
      document.querySelector('[data-q="maxdiff_worst"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setStatus('error');
      setMessage('Submission is temporarily unavailable.');
      return;
    }

    setStatus('sending');
    setMessage('');

    const referrer = document.referrer
      ? new URL(document.referrer).hostname
      : new URLSearchParams(window.location.search).get('src') || 'direct';

    const body = {
      in_long_term_relationship: a.in_long_term_relationship === 'yes',
      recent_unresolved: a.recent_unresolved === 'yes',
      conflict_frequency: a.conflict_frequency,
      relationship_length: a.relationship_length,
      last_conflict_about: a.last_conflict_about.trim() || null,
      first_30_min_actions: a.first_30_min_actions,
      did_resolve: a.did_resolve,
      tools_reached_for: a.tools_reached_for,
      csi_happiness: Number(a.csi_happiness),
      csi_going_well: Number(a.csi_going_well),
      csi_strong: Number(a.csi_strong),
      csi_warm: Number(a.csi_warm),
      concept_appeal: Number(a.concept_appeal),
      maxdiff_best: a.maxdiff_best,
      maxdiff_worst: a.maxdiff_worst,
      usage_blockers: a.usage_blockers.trim() || null,
      mode_preference: a.mode_preference,
      vw_too_cheap: parsePrice(a.vw_too_cheap),
      vw_bargain: parsePrice(a.vw_bargain),
      vw_expensive: parsePrice(a.vw_expensive),
      vw_too_expensive: parsePrice(a.vw_too_expensive),
      open_wish: a.open_wish.trim() || null,
      email: a.email.trim() || null,
      wants_early_access: a.wants_early_access && a.email.trim().length > 0,
      referrer,
      user_agent: navigator.userAgent.slice(0, 200),
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/research_responses_v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
        return;
      }

      if (body.wants_early_access && body.email) {
        await fetch(`${SUPABASE_URL}/rest/v1/waitlist_signups`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({ email: body.email, referrer: 'research_v2', user_agent: body.user_agent }),
        }).catch(() => {});
      }

      setStatus('success');
      setMessage('Thank you. Your answers will help us build something better.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setStatus('error');
      setMessage('Network hiccup. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="rs-thanks">
        <p className="rs-eyebrow" style={{ color: '#81b756' }}>THANK YOU</p>
        <h2 className="rs-thanks-title">{message}</h2>
        <p className="rs-thanks-sub">
          {a.wants_early_access && a.email
            ? "You're on the early-access list. We'll be in touch when Hey Otis opens up."
            : <>Want early access too? <a href="/#get-started">Join the waitlist →</a></>}
        </p>
      </div>
    );
  }

  // Worst options exclude the chosen best
  const worstOptions = STEPS.filter((s) => s.value !== a.maxdiff_best);

  return (
    <form className="rs-form" onSubmit={handleSubmit} noValidate>
      <div className="rs-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="rs-progress-bar" style={{ width: `${progress}%` }} />
        <span className="rs-progress-label">{progress}% complete</span>
      </div>

      {/* SCREENING */}
      <Section eyebrow="01 · QUICK SCREEN" title="A few quick ones to start.">
        <Choices dataKey="in_long_term_relationship" label="Are you currently in a long-term relationship (1+ years)?"
          choices={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          value={a.in_long_term_relationship} onChange={(v) => set('in_long_term_relationship', v)} />
        <Choices dataKey="relationship_length" label="How long have you been together?"
          choices={REL_LENGTH} value={a.relationship_length} onChange={(v) => set('relationship_length', v)} />
        <Choices dataKey="recent_unresolved" label="In the past 30 days, have you had a disagreement that didn't fully resolve?"
          choices={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          value={a.recent_unresolved} onChange={(v) => set('recent_unresolved', v)} />
        <Choices dataKey="conflict_frequency" label="How often does conflict like that happen?"
          choices={FREQUENCY} value={a.conflict_frequency} onChange={(v) => set('conflict_frequency', v)} />
      </Section>

      {/* BEHAVIOURAL RECALL */}
      <Section eyebrow="02 · YOUR LAST CONFLICT" title="Think about the most recent fight you had.">
        <div className="rs-q">
          <label className="rs-q-label">In one sentence, what was it about? (optional)</label>
          <textarea className="rs-textarea" rows={3} value={a.last_conflict_about}
            onChange={(e) => set('last_conflict_about', e.target.value)}
            placeholder="It can be vague. We&apos;re looking for patterns, not details." maxLength={500} />
        </div>
        <Multi dataKey="first_30_min_actions" label="What did you do in the first 30 minutes after?"
          choices={FIRST_30} values={a.first_30_min_actions}
          onToggle={(v) => toggleMulti('first_30_min_actions', v)} />
        <Choices dataKey="did_resolve" label="Did you ever go back and resolve it?"
          choices={RESOLVED} value={a.did_resolve} onChange={(v) => set('did_resolve', v)} />
        <Multi dataKey="tools_reached_for" label="What did you reach for, during or after, to help process it?"
          choices={TOOLS} values={a.tools_reached_for}
          onToggle={(v) => toggleMulti('tools_reached_for', v)} />
      </Section>

      {/* CSI-4 — validated short form */}
      <Section eyebrow="03 · YOUR RELATIONSHIP" title="Four quick questions about how things feel overall.">
        <Choices dataKey="csi_happiness" label="All things considered, how happy is your relationship?"
          choices={CSI_HAPPINESS} value={a.csi_happiness} onChange={(v) => set('csi_happiness', v)} />
        <Choices dataKey="csi_going_well" label="In general, how often do things between you and your partner go well?"
          choices={CSI_GOING_WELL} value={a.csi_going_well} onChange={(v) => set('csi_going_well', v)} />
        <Choices dataKey="csi_strong" label='&ldquo;Our relationship is strong.&rdquo;'
          choices={CSI_TRUE} value={a.csi_strong} onChange={(v) => set('csi_strong', v)} />
        <Choices dataKey="csi_warm" label='&ldquo;I have a warm and comfortable relationship with my partner.&rdquo;'
          choices={CSI_TRUE} value={a.csi_warm} onChange={(v) => set('csi_warm', v)} />
      </Section>

      {/* CONCEPT REACTION */}
      <Section eyebrow="04 · THE CONCEPT" title="Read this, then answer a few questions.">
        <div className="rs-concept">
          <p>
            <strong>Hey Otis</strong> is a private, in-the-moment guide for couples in conflict.
          </p>
          <p>
            Open it after a fight. Walk through four steps: <strong>vent</strong> what you&apos;re
            feeling, <strong>understand</strong> what&apos;s really going on underneath, <strong>prepare</strong>
            the right words, and <strong>nurture</strong> the actual conversation. Use it on your own,
            or sync with your partner.
          </p>
          <p>
            Private. EU-built. We never train on your data.
          </p>
        </div>
        <Choices dataKey="concept_appeal" label="How appealing does this sound to you?"
          choices={APPEAL} value={a.concept_appeal} onChange={(v) => set('concept_appeal', v)} />
        <Choices dataKey="maxdiff_best" label="Of the four steps, which would have helped MOST in your most recent conflict?"
          choices={STEPS} value={a.maxdiff_best} onChange={(v) => {
            set('maxdiff_best', v);
            if (a.maxdiff_worst === v) set('maxdiff_worst', '');
          }} />
        <Choices dataKey="maxdiff_worst" label="And which would have helped LEAST?"
          choices={worstOptions} value={a.maxdiff_worst} onChange={(v) => set('maxdiff_worst', v)} />
        <Choices dataKey="mode_preference" label="Would you want it just for you, for your partner, or both of you synced?"
          choices={MODE} value={a.mode_preference} onChange={(v) => set('mode_preference', v)} />
        <div className="rs-q">
          <label className="rs-q-label">What would stop you from using something like this in a real conflict? (optional)</label>
          <textarea className="rs-textarea" rows={3} value={a.usage_blockers}
            onChange={(e) => set('usage_blockers', e.target.value)}
            placeholder="Be honest. The hardest answers are the most useful." maxLength={500} />
        </div>
      </Section>

      {/* VAN WESTENDORP PRICING */}
      <Section eyebrow="05 · PRICING" title="Imagine Hey Otis exists today. What would it cost?">
        <p className="rs-meta" style={{ marginBottom: 16 }}>
          Four short pricing questions. Type the price you&apos;d pay per month, in any currency.
        </p>
        <PriceQ dataKey="vw_too_cheap"
          label="At what monthly price would this feel SO CHEAP that you&apos;d question whether it actually works?"
          value={a.vw_too_cheap} onChange={(v) => set('vw_too_cheap', v)} />
        <PriceQ dataKey="vw_bargain"
          label="At what monthly price would this feel like a BARGAIN, a great deal for the value?"
          value={a.vw_bargain} onChange={(v) => set('vw_bargain', v)} />
        <PriceQ dataKey="vw_expensive"
          label="At what monthly price would this feel EXPENSIVE, but still worth considering?"
          value={a.vw_expensive} onChange={(v) => set('vw_expensive', v)} />
        <PriceQ dataKey="vw_too_expensive"
          label="At what monthly price would it be SO EXPENSIVE that you&apos;d definitely not buy it?"
          value={a.vw_too_expensive} onChange={(v) => set('vw_too_expensive', v)} />
      </Section>

      {/* OPEN CLOSE */}
      <Section eyebrow="06 · ANYTHING ELSE" title="Last one, optional but gold.">
        <div className="rs-q">
          <label className="rs-q-label">What do you wish someone was building for couples in conflict?</label>
          <textarea className="rs-textarea" rows={4} value={a.open_wish}
            onChange={(e) => set('open_wish', e.target.value)}
            placeholder="Dream a little. We&apos;re listening." maxLength={1000} />
        </div>
      </Section>

      {/* EMAIL */}
      <Section eyebrow="07 · STAY IN TOUCH" title="Optional. Only if you want updates.">
        <div className="rs-q">
          <label className="rs-q-label">Email (optional)</label>
          <input type="email" className="rs-input" value={a.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="you@example.com" autoComplete="email" />
        </div>
        <label className="rs-checkbox">
          <input type="checkbox" checked={a.wants_early_access}
            onChange={(e) => set('wants_early_access', e.target.checked)} />
          <span>Add me to the early-access list for Hey Otis.</span>
        </label>
      </Section>

      <div className="rs-submit-wrap">
        <button type="submit" className="btn-primary btn-lg rs-submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Submitting…' : 'Submit answers'}
        </button>
        {message && status === 'error' && (<p className="rs-msg rs-msg--error">{message}</p>)}
        <p className="rs-fineprint">Your answers help us build something better. We&apos;ll never sell your data.</p>
      </div>
    </form>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rs-section">
      <p className="rs-section-eyebrow" dangerouslySetInnerHTML={{ __html: eyebrow }} />
      <h2 className="rs-section-title" dangerouslySetInnerHTML={{ __html: title }} />
      <div className="rs-section-body">{children}</div>
    </div>
  );
}

function Choices({ dataKey, label, choices, value, onChange }:
  { dataKey: string; label: string; choices: Choice[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="rs-q" data-q={dataKey}>
      <label className="rs-q-label" dangerouslySetInnerHTML={{ __html: label }} />
      <div className="rs-choices">
        {choices.map((c) => {
          const selected = value === c.value;
          return (
            <button key={c.value} type="button"
              className={`rs-choice ${selected ? 'rs-choice--on' : ''}`}
              onClick={() => onChange(c.value)} aria-pressed={selected}>
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Multi({ dataKey, label, choices, values, onToggle }:
  { dataKey: string; label: string; choices: Choice[]; values: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="rs-q" data-q={dataKey}>
      <label className="rs-q-label">{label}</label>
      <p className="rs-q-hint">Pick all that apply.</p>
      <div className="rs-choices">
        {choices.map((c) => {
          const selected = values.includes(c.value);
          return (
            <button key={c.value} type="button"
              className={`rs-choice ${selected ? 'rs-choice--on' : ''}`}
              onClick={() => onToggle(c.value)} aria-pressed={selected}>
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PriceQ({ dataKey, label, value, onChange }:
  { dataKey: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="rs-q" data-q={dataKey}>
      <label className="rs-q-label" dangerouslySetInnerHTML={{ __html: label }} />
      <div className="rs-price-row">
        <span className="rs-price-cur">€</span>
        <input type="text" inputMode="decimal" className="rs-input rs-price-input"
          value={value} onChange={(e) => onChange(e.target.value)}
          placeholder="0.00" />
        <span className="rs-price-suffix">/ month</span>
      </div>
    </div>
  );
}
