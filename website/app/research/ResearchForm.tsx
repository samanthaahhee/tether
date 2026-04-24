'use client';

import { useMemo, useState, FormEvent } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

type Status = 'idle' | 'sending' | 'success' | 'error';
type Choice = { value: string; label: string };

const REL_LENGTH: Choice[] = [
  { value: 'lt_1', label: 'Less than 1 year' },
  { value: '1_3', label: '1–3 years' },
  { value: '3_7', label: '3–7 years' },
  { value: '7_plus', label: '7+ years' },
  { value: 'single', label: 'Single / between relationships' },
];

const REL_STATE: Choice[] = [
  { value: 'thriving', label: 'Thriving' },
  { value: 'good_w_rough', label: 'Mostly good, with rough patches' },
  { value: 'struggling', label: 'Struggling' },
  { value: 'crisis', label: 'In crisis' },
  { value: 'unsure', label: 'Honestly, not sure' },
];

const CONFLICT_PATTERN: Choice[] = [
  { value: 'talk_calm', label: 'We talk it through, mostly calmly' },
  { value: 'argue_makeup', label: 'We argue, then make up' },
  { value: 'one_shuts_down', label: 'One of us shuts down' },
  { value: 'avoid', label: 'We tend to avoid it' },
  { value: 'escalate', label: 'It usually escalates badly' },
];

const FIGHT_TOPICS: Choice[] = [
  { value: 'communication', label: 'How we communicate' },
  { value: 'money', label: 'Money' },
  { value: 'sex_intimacy', label: 'Sex / intimacy' },
  { value: 'household', label: 'Household / chores' },
  { value: 'time', label: 'Time + attention' },
  { value: 'parenting', label: 'Parenting' },
  { value: 'in_laws', label: 'Family / in-laws' },
  { value: 'trust', label: 'Trust + jealousy' },
  { value: 'future', label: 'Future plans' },
  { value: 'other', label: 'Something else' },
];

const FIGHTS_RESOLVED: Choice[] = [
  { value: 'always', label: 'Almost always' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'rarely', label: 'Rarely' },
  { value: 'never', label: 'Never, they just get dropped' },
];

const FRAMEWORKS_MULTI: Choice[] = [
  { value: 'attachment', label: 'Attachment styles' },
  { value: 'love_languages', label: 'Love languages' },
  { value: 'gottman', label: "Gottman's conflict styles" },
  { value: 'nvc', label: 'Nonviolent communication (NVC)' },
  { value: 'none', label: 'None of the above' },
];

const REAL_ISSUE: Choice[] = [
  { value: 'always', label: 'Almost always' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'rarely', label: 'Rarely' },
  { value: 'never', label: "Honestly, never" },
];

const THERAPY_STATUS: Choice[] = [
  { value: 'currently', label: 'Yes, currently' },
  { value: 'past', label: 'Yes, in the past' },
  { value: 'no_open', label: "No, open to it" },
  { value: 'no_closed', label: "No, not for me" },
];

const THERAPY_HELP: Choice[] = [
  { value: 'very', label: 'Very helpful' },
  { value: 'somewhat', label: 'Somewhat' },
  { value: 'not_really', label: 'Not really' },
  { value: 'made_worse', label: 'Made things worse' },
];

const THERAPY_FREQUENCY: Choice[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'occasional', label: 'Occasionally / as needed' },
  { value: 'stopped', label: "We stopped going" },
];

const THERAPY_BLOCKERS: Choice[] = [
  { value: 'cost', label: 'Too expensive' },
  { value: 'partner_unwilling', label: 'Partner is not open to it' },
  { value: 'dont_know_how', label: "I don't know how to start" },
  { value: 'prefer_alone', label: 'I prefer to handle things myself' },
  { value: 'dont_believe', label: "I don't think it would help" },
  { value: 'stigma', label: 'Stigma / judgement' },
  { value: 'time', label: 'No time' },
  { value: 'never_thought', label: "Never really thought about it" },
];

const USED_AI: Choice[] = [
  { value: 'regularly', label: 'Yes, regularly' },
  { value: 'tried', label: 'Tried it once or twice' },
  { value: 'never', label: "Never, but I'd consider it" },
  { value: 'no_way', label: "No, and I wouldn't" },
];

const LIKERT: Choice[] = [
  { value: '1', label: 'Strongly disagree' },
  { value: '2', label: 'Disagree' },
  { value: '3', label: 'Neutral' },
  { value: '4', label: 'Agree' },
  { value: '5', label: 'Strongly agree' },
];

type Answers = {
  rel_length: string;
  rel_state: string;
  conflict_pattern: string;
  fight_topics: string[];
  fights_resolved: string;
  talk_openly: string;          // likert
  hard_to_find_words: string;   // likert
  wish_partner_understood: string; // likert
  has_tools_eq: string;         // likert
  knows_frameworks: string[];
  knows_real_issue: string;
  therapy_status: string;
  therapy_helpfulness: string;
  therapy_frequency: string;
  therapy_blockers: string[];
  used_ai_for_advice: string;
  comfort_sharing_ai: string;   // likert
  hardest_part: string;
  ideal_tool: string;
  email: string;
  wants_early_access: boolean;
};

const EMPTY: Answers = {
  rel_length: '',
  rel_state: '',
  conflict_pattern: '',
  fight_topics: [],
  fights_resolved: '',
  talk_openly: '',
  hard_to_find_words: '',
  wish_partner_understood: '',
  has_tools_eq: '',
  knows_frameworks: [],
  knows_real_issue: '',
  therapy_status: '',
  therapy_helpfulness: '',
  therapy_frequency: '',
  therapy_blockers: [],
  used_ai_for_advice: '',
  comfort_sharing_ai: '',
  hardest_part: '',
  ideal_tool: '',
  email: '',
  wants_early_access: false,
};

// Required base questions (therapy follow-ups handled conditionally below)
const REQUIRED_KEYS: (keyof Answers)[] = [
  'rel_length',
  'rel_state',
  'conflict_pattern',
  'fight_topics',
  'fights_resolved',
  'talk_openly',
  'hard_to_find_words',
  'wish_partner_understood',
  'has_tools_eq',
  'knows_frameworks',
  'knows_real_issue',
  'therapy_status',
  'used_ai_for_advice',
  'comfort_sharing_ai',
];

function isFilled(value: string | string[]): boolean {
  return Array.isArray(value) ? value.length > 0 : value.length > 0;
}

export default function ResearchForm() {
  const [a, setA] = useState<Answers>(EMPTY);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const therapyDone = a.therapy_status === 'currently' || a.therapy_status === 'past';
  const therapyBlocked = a.therapy_status === 'no_open' || a.therapy_status === 'no_closed';
  const isCurrent = a.therapy_status === 'currently';

  const requiredCount = useMemo(() => {
    let count = REQUIRED_KEYS.length;
    if (therapyDone) count += 1; // helpfulness
    if (isCurrent) count += 1;   // frequency
    if (therapyBlocked) count += 1; // blockers
    return count;
  }, [therapyDone, therapyBlocked, isCurrent]);

  const filledCount = useMemo(() => {
    let n = REQUIRED_KEYS.filter((k) => isFilled(a[k] as string | string[])).length;
    if (therapyDone && a.therapy_helpfulness) n += 1;
    if (isCurrent && a.therapy_frequency) n += 1;
    if (therapyBlocked && a.therapy_blockers.length > 0) n += 1;
    return n;
  }, [a, therapyDone, isCurrent, therapyBlocked]);

  const progress = Math.round((filledCount / requiredCount) * 100);

  function set<K extends keyof Answers>(key: K, value: Answers[K]) {
    setA((prev) => ({ ...prev, [key]: value }));
  }

  function toggleMulti<K extends 'fight_topics' | 'knows_frameworks' | 'therapy_blockers'>(key: K, value: string) {
    setA((prev) => {
      const arr = prev[key] as string[];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const missing: string[] = [];
    REQUIRED_KEYS.forEach((k) => { if (!isFilled(a[k] as string | string[])) missing.push(k); });
    if (therapyDone && !a.therapy_helpfulness) missing.push('therapy_helpfulness');
    if (isCurrent && !a.therapy_frequency) missing.push('therapy_frequency');
    if (therapyBlocked && a.therapy_blockers.length === 0) missing.push('therapy_blockers');

    if (missing.length) {
      setStatus('error');
      setMessage(`Please answer the ${missing.length} remaining ${missing.length === 1 ? 'question' : 'questions'}.`);
      const firstEl = document.querySelector(`[data-q="${missing[0]}"]`);
      firstEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      rel_length: a.rel_length,
      rel_state: a.rel_state,
      conflict_pattern: a.conflict_pattern,
      fight_topics: a.fight_topics,
      fights_resolved: a.fights_resolved,
      talk_openly: Number(a.talk_openly),
      hard_to_find_words: Number(a.hard_to_find_words),
      wish_partner_understood: Number(a.wish_partner_understood),
      has_tools_eq: Number(a.has_tools_eq),
      knows_frameworks: a.knows_frameworks,
      knows_real_issue: a.knows_real_issue,
      therapy_status: a.therapy_status,
      therapy_helpfulness: therapyDone ? a.therapy_helpfulness : null,
      therapy_frequency: isCurrent ? a.therapy_frequency : null,
      therapy_blockers: therapyBlocked ? a.therapy_blockers : null,
      used_ai_for_advice: a.used_ai_for_advice,
      comfort_sharing_ai: Number(a.comfort_sharing_ai),
      hardest_part: a.hardest_part.trim() || null,
      ideal_tool: a.ideal_tool.trim() || null,
      email: a.email.trim() || null,
      wants_early_access: a.wants_early_access && a.email.trim().length > 0,
      referrer,
      user_agent: navigator.userAgent.slice(0, 200),
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/research_responses`, {
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
          body: JSON.stringify({ email: body.email, referrer: 'research', user_agent: body.user_agent }),
        }).catch(() => {});
      }

      setStatus('success');
      setMessage('Thank you. Your answers will help shape what we build next.');
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

  return (
    <form className="rs-form" onSubmit={handleSubmit} noValidate>
      <div className="rs-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="rs-progress-bar" style={{ width: `${progress}%` }} />
        <span className="rs-progress-label">{progress}% complete</span>
      </div>

      {/* SECTION 1 */}
      <Section eyebrow="01 · YOUR RELATIONSHIP" title="Where are you right now?">
        <Choices dataKey="rel_length" label="How long have you been with your current partner?" choices={REL_LENGTH} value={a.rel_length} onChange={(v) => set('rel_length', v)} />
        <Choices dataKey="rel_state" label="How would you describe the state of your relationship today?" choices={REL_STATE} value={a.rel_state} onChange={(v) => set('rel_state', v)} />
      </Section>

      {/* SECTION 2 */}
      <Section eyebrow="02 · HOW FIGHTS PLAY OUT" title="The shape of your conflict.">
        <Choices dataKey="conflict_pattern" label="When you and your partner disagree, what usually happens?" choices={CONFLICT_PATTERN} value={a.conflict_pattern} onChange={(v) => set('conflict_pattern', v)} />
        <Multi dataKey="fight_topics" label="What do most of your fights end up being about? (pick any that apply)" choices={FIGHT_TOPICS} values={a.fight_topics} onToggle={(v) => toggleMulti('fight_topics', v)} />
        <Choices dataKey="fights_resolved" label="When you fight, do you actually resolve it?" choices={FIGHTS_RESOLVED} value={a.fights_resolved} onChange={(v) => set('fights_resolved', v)} />
      </Section>

      {/* SECTION 3 */}
      <Section eyebrow="03 · OPENNESS &amp; TOOLS" title="What it feels like inside.">
        <Likert dataKey="talk_openly" label='&ldquo;I can talk to my partner openly and honestly about hard things.&rdquo;' value={a.talk_openly} onChange={(v) => set('talk_openly', v)} />
        <Likert dataKey="hard_to_find_words" label='&ldquo;I often struggle to find the right words in the heat of an argument.&rdquo;' value={a.hard_to_find_words} onChange={(v) => set('hard_to_find_words', v)} />
        <Likert dataKey="wish_partner_understood" label='&ldquo;I wish my partner understood what I was really feeling more often.&rdquo;' value={a.wish_partner_understood} onChange={(v) => set('wish_partner_understood', v)} />
        <Likert dataKey="has_tools_eq" label='&ldquo;I feel I have the emotional tools to navigate hard moments with my partner.&rdquo;' value={a.has_tools_eq} onChange={(v) => set('has_tools_eq', v)} />
      </Section>

      {/* SECTION 4 */}
      <Section eyebrow="04 · CONFLICT AWARENESS" title="What you know about how you fight.">
        <Multi dataKey="knows_frameworks" label="Which of these are you familiar with? (pick any)" choices={FRAMEWORKS_MULTI} values={a.knows_frameworks} onToggle={(v) => toggleMulti('knows_frameworks', v)} />
        <Choices dataKey="knows_real_issue" label="In the middle of a fight, do you know what it's really about?" choices={REAL_ISSUE} value={a.knows_real_issue} onChange={(v) => set('knows_real_issue', v)} />
      </Section>

      {/* SECTION 5 */}
      <Section eyebrow="05 · COUPLES THERAPY" title="Have you tried it?">
        <Choices dataKey="therapy_status" label="Have you ever done couples therapy?" choices={THERAPY_STATUS} value={a.therapy_status} onChange={(v) => set('therapy_status', v)} />

        {therapyDone && (
          <Choices dataKey="therapy_helpfulness" label="How helpful was (or is) it?" choices={THERAPY_HELP} value={a.therapy_helpfulness} onChange={(v) => set('therapy_helpfulness', v)} />
        )}

        {isCurrent && (
          <Choices dataKey="therapy_frequency" label="How often do you go?" choices={THERAPY_FREQUENCY} value={a.therapy_frequency} onChange={(v) => set('therapy_frequency', v)} />
        )}

        {therapyBlocked && (
          <Multi dataKey="therapy_blockers" label="What's holding you back? (pick any)" choices={THERAPY_BLOCKERS} values={a.therapy_blockers} onToggle={(v) => toggleMulti('therapy_blockers', v)} />
        )}
      </Section>

      {/* SECTION 6 */}
      <Section eyebrow="06 · AI &amp; EMOTIONAL SUPPORT" title="How do you feel about AI helping?">
        <Choices dataKey="used_ai_for_advice" label="Have you ever used ChatGPT (or similar) for relationship or emotional support?" choices={USED_AI} value={a.used_ai_for_advice} onChange={(v) => set('used_ai_for_advice', v)} />
        <Likert dataKey="comfort_sharing_ai" label='&ldquo;I&rsquo;d feel comfortable sharing private relationship details with an AI if I knew it was secure and not used for ads or training.&rdquo;' value={a.comfort_sharing_ai} onChange={(v) => set('comfort_sharing_ai', v)} />
      </Section>

      {/* SECTION 7 */}
      <Section eyebrow="07 · IN YOUR OWN WORDS" title="Optional, but the most useful answers we get.">
        <div className="rs-q">
          <label className="rs-q-label">What&apos;s the hardest part of communicating with your partner?</label>
          <textarea className="rs-textarea" rows={4} value={a.hardest_part} onChange={(e) => set('hardest_part', e.target.value)} placeholder="Take your time. There&apos;s no wrong answer." maxLength={1000} />
        </div>
        <div className="rs-q">
          <label className="rs-q-label">If a tool could actually help with your relationship, what would it do?</label>
          <textarea className="rs-textarea" rows={4} value={a.ideal_tool} onChange={(e) => set('ideal_tool', e.target.value)} placeholder="Dream a little. We&apos;re listening." maxLength={1000} />
        </div>
      </Section>

      {/* SECTION 8 */}
      <Section eyebrow="08 · STAY IN TOUCH" title="Optional. We&rsquo;ll only email if you ask.">
        <div className="rs-q">
          <label className="rs-q-label">Email (optional)</label>
          <input type="email" className="rs-input" value={a.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" autoComplete="email" />
        </div>
        <label className="rs-checkbox">
          <input type="checkbox" checked={a.wants_early_access} onChange={(e) => set('wants_early_access', e.target.checked)} />
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

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rs-section">
      <p className="rs-section-eyebrow" dangerouslySetInnerHTML={{ __html: eyebrow }} />
      <h2 className="rs-section-title" dangerouslySetInnerHTML={{ __html: title }} />
      <div className="rs-section-body">{children}</div>
    </div>
  );
}

function Choices({ dataKey, label, choices, value, onChange }: { dataKey: string; label: string; choices: Choice[]; value: string; onChange: (v: string) => void; }) {
  return (
    <div className="rs-q" data-q={dataKey}>
      <label className="rs-q-label">{label}</label>
      <div className="rs-choices">
        {choices.map((c) => {
          const selected = value === c.value;
          return (
            <button key={c.value} type="button" className={`rs-choice ${selected ? 'rs-choice--on' : ''}`} onClick={() => onChange(c.value)} aria-pressed={selected}>
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Multi({ dataKey, label, choices, values, onToggle }: { dataKey: string; label: string; choices: Choice[]; values: string[]; onToggle: (v: string) => void; }) {
  return (
    <div className="rs-q" data-q={dataKey}>
      <label className="rs-q-label">{label}</label>
      <div className="rs-choices">
        {choices.map((c) => {
          const selected = values.includes(c.value);
          return (
            <button key={c.value} type="button" className={`rs-choice ${selected ? 'rs-choice--on' : ''}`} onClick={() => onToggle(c.value)} aria-pressed={selected}>
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Likert({ dataKey, label, value, onChange }: { dataKey: string; label: string; value: string; onChange: (v: string) => void; }) {
  return (
    <div className="rs-q" data-q={dataKey}>
      <label className="rs-q-label" dangerouslySetInnerHTML={{ __html: label }} />
      <div className="rs-likert">
        {LIKERT.map((c) => {
          const selected = value === c.value;
          return (
            <button key={c.value} type="button" className={`rs-likert-pill ${selected ? 'rs-likert-pill--on' : ''}`} onClick={() => onChange(c.value)} aria-pressed={selected} aria-label={c.label}>
              <span className="rs-likert-num">{c.value}</span>
              <span className="rs-likert-text">{c.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
