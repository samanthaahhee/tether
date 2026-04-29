'use client';

import { useMemo, useState, FormEvent } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

type Status = 'idle' | 'sending' | 'success' | 'error' | 'disqualified';
type Choice = { value: string; label: string };

// ── Choice sets ─────────────────────────────────────────────────────────

const RELATIONSHIP_STATUS: Choice[] = [
  { value: 'married', label: 'Married or in a civil partnership' },
  { value: 'lt_living', label: 'Long-term partnered (1+ years), living together' },
  { value: 'lt_apart', label: 'Long-term partnered (1+ years), living apart' },
  { value: 'newer', label: 'Newer relationship (less than 1 year)' },
  { value: 'single', label: 'Single right now' },
];

const REL_LENGTH: Choice[] = [
  { value: 'lt_1', label: 'Less than 1 year' },
  { value: '1_3', label: '1 to 3 years' },
  { value: '3_7', label: '3 to 7 years' },
  { value: '7_15', label: '7 to 15 years' },
  { value: '15_plus', label: '15+ years' },
];

const UNRESOLVED_COUNT: Choice[] = [
  { value: 'none', label: 'None' },
  { value: '1', label: 'One' },
  { value: '2_3', label: '2 to 3' },
  { value: '4_6', label: '4 to 6' },
  { value: 'more_6', label: 'More than 6' },
];

const FREQUENCY: Choice[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'several_week', label: 'Several times a week' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'A few times a month' },
  { value: 'few_times_year', label: 'A few times a year' },
  { value: 'rarely', label: 'Rarely' },
];

const ABUSIVE: Choice[] = [
  { value: 'no', label: 'No' },
  { value: 'past', label: 'Yes, in the past' },
  { value: 'currently', label: 'Yes, currently' },
  { value: 'prefer_not', label: 'Prefer not to say' },
];

const TOOLS: Choice[] = [
  { value: 'couples_therapy', label: 'Couples therapy' },
  { value: 'individual_therapy', label: 'My own individual therapist' },
  { value: 'self_help', label: 'Self-help books' },
  { value: 'workbooks', label: 'Workbooks or worksheets' },
  { value: 'apps', label: 'Relationship apps' },
  { value: 'ai_chat', label: 'ChatGPT, Claude, or any AI chatbot' },
  { value: 'podcasts', label: 'Podcasts' },
  { value: 'social', label: 'Social media (IG / TikTok therapists)' },
  { value: 'friends', label: 'Friends or family' },
  { value: 'helpline', label: 'A helpline or hotline' },
  { value: 'religious', label: 'A religious or spiritual community' },
  { value: 'coach', label: "A couple's coach or mediator" },
  { value: 'nothing', label: 'Nothing, honestly' },
];

const AI_USAGE_FOR: Choice[] = [
  { value: 'draft_message', label: 'Drafting a message I was nervous to send' },
  { value: 'talk_through_fight', label: 'Talking through a fight or hard moment' },
  { value: 'understand_partner', label: "Understanding my partner's behaviour" },
  { value: 'process_emotions', label: 'Processing my own emotions or anxiety' },
  { value: 'lookup_advice', label: 'Looking up advice on a relationship problem' },
  { value: 'practise_conversation', label: 'Practising a difficult conversation' },
  { value: 'never', label: "I haven't used AI for any of this" },
];

const LAST_CONFLICT_WHEN: Choice[] = [
  { value: 'today', label: 'Today' },
  { value: 'past_week', label: 'In the past week' },
  { value: '2_4_weeks', label: '2 to 4 weeks ago' },
  { value: '1_3_months', label: '1 to 3 months ago' },
  { value: 'longer', label: 'Longer ago' },
];

const FIRST_30: Choice[] = [
  { value: 'shut_down', label: 'Shut down or went quiet' },
  { value: 'yelled', label: 'Argued more, yelled' },
  { value: 'cried', label: 'Cried' },
  { value: 'walked_out', label: 'Walked out, left the room or house' },
  { value: 'vented_friend', label: 'Vented to a friend or family' },
  { value: 'texted_partner', label: 'Texted my partner about it' },
  { value: 'googled', label: 'Googled or read articles' },
  { value: 'journaled', label: 'Journaled or wrote it out' },
  { value: 'talked_partner', label: 'Talked it through with my partner' },
  { value: 'slept', label: 'Slept on it / waited it out' },
  { value: 'used_ai', label: 'Used ChatGPT or another AI' },
  { value: 'drink_med', label: 'Had a drink or took something to take the edge off' },
  { value: 'other', label: 'Something else' },
];

const RESOLVED: Choice[] = [
  { value: 'yes_fully', label: 'Yes, fully' },
  { value: 'yes_days', label: 'Yes, but it took days' },
  { value: 'partially', label: 'Partially' },
  { value: 'still', label: 'Still working on it' },
  { value: 'dropped', label: 'Dropped without resolution' },
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
  { value: 'both', label: 'Both of us, synced from the start' },
  { value: 'start_solo', label: "I'd start solo and see" },
];

// CSI-4 (Funk & Rogge, 2007)
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

const APPEAL_7: Choice[] = [
  { value: '1', label: 'Not appealing at all' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: 'Neutral' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: 'Extremely appealing' },
];

const PARTNER_BUY_IN: Choice[] = [
  { value: '1', label: 'Definitely would not' },
  { value: '2', label: 'Probably not' },
  { value: '3', label: 'Maybe' },
  { value: '4', label: 'Probably yes' },
  { value: '5', label: 'Definitely yes' },
];

const PRICING_MODEL: Choice[] = [
  { value: 'free_tier', label: 'Free with optional paid features' },
  { value: 'sub_monthly', label: 'Monthly subscription' },
  { value: 'sub_annual', label: 'Annual subscription (cheaper monthly)' },
  { value: 'one_time', label: 'One-time purchase' },
  { value: 'couple_plan', label: 'Couple plan (one price for both)' },
  { value: 'pay_per_use', label: 'Pay per use / per session' },
];

const INPUT_MODALITY: Choice[] = [
  { value: 'type', label: 'Type' },
  { value: 'voice', label: 'Talk (voice)' },
  { value: 'both', label: 'Both equally' },
  { value: 'depends', label: 'Depends on the moment' },
];

const USAGE_MOMENTS: Choice[] = [
  { value: 'late_night', label: 'Late at night' },
  { value: 'right_after', label: 'Right after a fight' },
  { value: 'next_morning', label: 'The next morning' },
  { value: 'weekend_am', label: 'Weekend mornings' },
  { value: 'work_hours', label: 'During work hours' },
  { value: 'before_bed', label: 'Before bed' },
  { value: 'commute', label: 'On a commute' },
  { value: 'other', label: 'Other' },
];

const INTERVIEW: Choice[] = [
  { value: 'yes', label: "Yes, I'd be happy to chat" },
  { value: 'maybe', label: 'Maybe, depending on timing' },
  { value: 'no', label: 'No thanks' },
];

const CURRENCIES: Choice[] = [
  { value: 'EUR', label: '€ EUR' },
  { value: 'GBP', label: '£ GBP' },
  { value: 'USD', label: '$ USD' },
  { value: 'AUD', label: '$ AUD' },
  { value: 'CAD', label: '$ CAD' },
  { value: 'OTHER', label: 'Other' },
];

const AGE: Choice[] = [
  { value: 'lt_25', label: 'Under 25' },
  { value: '25_34', label: '25–34' },
  { value: '35_44', label: '35–44' },
  { value: '45_54', label: '45–54' },
  { value: '55_64', label: '55–64' },
  { value: '65_plus', label: '65+' },
  { value: 'prefer_not', label: 'Prefer not to say' },
];

const GENDER: Choice[] = [
  { value: 'woman', label: 'Woman' },
  { value: 'man', label: 'Man' },
  { value: 'nonbinary', label: 'Non-binary' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not', label: 'Prefer not to say' },
];

const ORIENTATION: Choice[] = [
  { value: 'straight', label: 'Straight / heterosexual' },
  { value: 'gay', label: 'Gay / lesbian' },
  { value: 'bisexual', label: 'Bisexual' },
  { value: 'queer', label: 'Queer' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not', label: 'Prefer not to say' },
];

const EDUCATION: Choice[] = [
  { value: 'secondary', label: 'Secondary school' },
  { value: 'some_uni', label: 'Some university' },
  { value: 'bachelors', label: "Bachelor's" },
  { value: 'masters_phd', label: "Master's / PhD" },
  { value: 'trade', label: 'Trade or vocational' },
  { value: 'prefer_not', label: 'Prefer not to say' },
];

const INCOME: Choice[] = [
  { value: 'lt_30', label: 'Under €30k' },
  { value: '30_60', label: '€30–60k' },
  { value: '60_100', label: '€60–100k' },
  { value: '100_150', label: '€100–150k' },
  { value: '150_plus', label: '€150k+' },
  { value: 'prefer_not', label: 'Prefer not to say' },
];

const KIDS: Choice[] = [
  { value: 'no', label: 'No' },
  { value: 'under_5', label: 'Yes, under 5' },
  { value: '5_12', label: 'Yes, 5–12' },
  { value: 'teens', label: 'Yes, teens' },
  { value: 'adult_home', label: 'Yes, adult kids still at home' },
  { value: 'adult_left', label: 'Yes, adult kids who left home' },
  { value: 'prefer_not', label: 'Prefer not to say' },
];

const THERAPY_HISTORY: Choice[] = [
  { value: 'never', label: 'Never' },
  { value: 'individual_only', label: 'Individual therapy only' },
  { value: 'couples_now', label: 'Couples therapy currently' },
  { value: 'couples_past', label: 'Couples therapy in the past' },
  { value: 'both', label: 'Both individual + couples' },
  { value: 'prefer_not', label: 'Prefer not to say' },
];

// Common countries first, then alphabetical. Keep short for performance.
const COUNTRIES: Choice[] = [
  { value: 'NL', label: 'Netherlands' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'US', label: 'United States' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'BE', label: 'Belgium' },
  { value: 'IE', label: 'Ireland' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
  { value: 'AU', label: 'Australia' },
  { value: 'CA', label: 'Canada' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'SE', label: 'Sweden' },
  { value: 'DK', label: 'Denmark' },
  { value: 'NO', label: 'Norway' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'AT', label: 'Austria' },
  { value: 'PT', label: 'Portugal' },
  { value: 'PL', label: 'Poland' },
  { value: 'OTHER', label: 'Other / not listed' },
];

// ── Answer state ────────────────────────────────────────────────────────

type Answers = {
  consent_acknowledged: boolean;
  // Screen
  relationship_status: string;
  relationship_length: string;
  unresolved_count_30d: string;
  conflict_frequency: string;
  abusive_relationship: string;
  // Tools (incl AI)
  tools_reached_for: string[];
  ai_usage_for_emotional: string[];
  ai_usage_what_worked: string;
  // Last conflict
  last_conflict_about: string;
  last_conflict_when: string;
  first_30_min_actions: string[];
  did_resolve: string;
  // Concept
  concept_appeal: string;
  maxdiff_best: string;
  maxdiff_worst: string;
  mode_preference: string;
  usage_blockers: string;
  trust_requirement: string;
  // CSI-4
  csi_happiness: string;
  csi_going_well: string;
  csi_strong: string;
  csi_warm: string;
  // Pricing + product
  price_currency: string;
  vw_too_cheap: string;
  vw_bargain: string;
  vw_expensive: string;
  vw_too_expensive: string;
  pricing_model_preference: string;
  partner_buy_in: string;
  input_modality: string;
  usage_moments: string[];
  // Open + interview
  open_wish: string;
  tape_recorder: string;
  interview_willingness: string;
  interview_email: string;
  // Demographics
  age_band: string;
  gender: string;
  sexual_orientation: string;
  country: string;
  education: string;
  household_income: string;
  has_kids: string;
  therapy_history: string;
  // Email
  email: string;
  wants_early_access: boolean;
};

const EMPTY: Answers = {
  consent_acknowledged: false,
  relationship_status: '', relationship_length: '', unresolved_count_30d: '',
  conflict_frequency: '', abusive_relationship: '',
  tools_reached_for: [], ai_usage_for_emotional: [], ai_usage_what_worked: '',
  last_conflict_about: '', last_conflict_when: '', first_30_min_actions: [], did_resolve: '',
  concept_appeal: '', maxdiff_best: '', maxdiff_worst: '', mode_preference: '',
  usage_blockers: '', trust_requirement: '',
  csi_happiness: '', csi_going_well: '', csi_strong: '', csi_warm: '',
  price_currency: 'EUR',
  vw_too_cheap: '', vw_bargain: '', vw_expensive: '', vw_too_expensive: '',
  pricing_model_preference: '', partner_buy_in: '', input_modality: '', usage_moments: [],
  open_wish: '', tape_recorder: '', interview_willingness: '', interview_email: '',
  age_band: '', gender: '', sexual_orientation: '', country: '',
  education: '', household_income: '', has_kids: '', therapy_history: '',
  email: '', wants_early_access: false,
};

const REQUIRED_KEYS: (keyof Answers)[] = [
  'relationship_status', 'relationship_length', 'unresolved_count_30d',
  'conflict_frequency', 'abusive_relationship',
  'tools_reached_for', 'ai_usage_for_emotional',
  'last_conflict_about', 'last_conflict_when', 'first_30_min_actions', 'did_resolve',
  'concept_appeal', 'maxdiff_best', 'maxdiff_worst', 'mode_preference', 'usage_blockers',
  'csi_happiness', 'csi_going_well', 'csi_strong', 'csi_warm',
  'partner_buy_in', 'input_modality', 'usage_moments',
  'interview_willingness',
  'age_band', 'gender', 'country',
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

const CURRENCY_SYMBOL: Record<string, string> = {
  EUR: '€', GBP: '£', USD: '$', AUD: 'A$', CAD: 'C$', OTHER: '',
};

// ── Component ───────────────────────────────────────────────────────────

export default function ResearchFormV2() {
  const [a, setA] = useState<Answers>(EMPTY);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  // Hard disqualify: not in a relationship at all
  const isDisqualified = a.relationship_status === 'single';

  const progress = useMemo(() => {
    const filled = REQUIRED_KEYS.filter((k) => isFilled(a[k] as string | string[])).length;
    return Math.round((filled / REQUIRED_KEYS.length) * 100);
  }, [a]);

  function set<K extends keyof Answers>(key: K, value: Answers[K]) {
    setA((prev) => ({ ...prev, [key]: value }));
  }

  function toggleMulti(key: 'tools_reached_for' | 'ai_usage_for_emotional' | 'first_30_min_actions' | 'usage_moments', value: string) {
    setA((prev) => {
      const arr = prev[key];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isDisqualified) {
      setStatus('disqualified');
      return;
    }

    const missing = REQUIRED_KEYS.filter((k) => !isFilled(a[k] as string | string[]));
    if (missing.length) {
      setStatus('error');
      setMessage(`Please answer the ${missing.length} remaining ${missing.length === 1 ? 'question' : 'questions'}.`);
      const firstEl = document.querySelector(`[data-q="${missing[0]}"]`);
      firstEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (a.maxdiff_best && a.maxdiff_worst && a.maxdiff_best === a.maxdiff_worst) {
      setStatus('error');
      setMessage('Best and least-helpful step should be different.');
      document.querySelector('[data-q="maxdiff_worst"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Van Westendorp logical-consistency check
    const tc = parsePrice(a.vw_too_cheap), bg = parsePrice(a.vw_bargain),
          ex = parsePrice(a.vw_expensive), te = parsePrice(a.vw_too_expensive);
    if (tc != null && bg != null && ex != null && te != null) {
      if (!(tc <= bg && bg <= ex && ex <= te)) {
        setStatus('error');
        setMessage('Pricing answers should go from cheapest to most expensive. Please re-check.');
        document.querySelector('[data-q="vw_too_cheap"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
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
      consent_acknowledged: true, // implicit by reaching submit
      // Screen
      relationship_status: a.relationship_status,
      relationship_length: a.relationship_length,
      unresolved_count_30d: a.unresolved_count_30d,
      conflict_frequency: a.conflict_frequency,
      abusive_relationship: a.abusive_relationship,
      // Tools
      tools_reached_for: a.tools_reached_for,
      ai_usage_for_emotional: a.ai_usage_for_emotional,
      ai_usage_what_worked: a.ai_usage_what_worked.trim() || null,
      // Last conflict
      last_conflict_about: a.last_conflict_about.trim(),
      last_conflict_when: a.last_conflict_when,
      first_30_min_actions: a.first_30_min_actions,
      did_resolve: a.did_resolve,
      // Legacy v2 mirrors (for v1-style queries)
      in_long_term_relationship: a.relationship_status !== 'single' && a.relationship_status !== 'newer',
      recent_unresolved: a.unresolved_count_30d !== 'none',
      // Concept
      concept_appeal: Number(a.concept_appeal),
      maxdiff_best: a.maxdiff_best,
      maxdiff_worst: a.maxdiff_worst,
      mode_preference: a.mode_preference,
      usage_blockers: a.usage_blockers.trim(),
      trust_requirement: a.trust_requirement.trim() || null,
      // CSI-4
      csi_happiness: Number(a.csi_happiness),
      csi_going_well: Number(a.csi_going_well),
      csi_strong: Number(a.csi_strong),
      csi_warm: Number(a.csi_warm),
      // Pricing
      price_currency: a.price_currency,
      vw_too_cheap: tc, vw_bargain: bg, vw_expensive: ex, vw_too_expensive: te,
      pricing_model_preference: a.pricing_model_preference || null,
      partner_buy_in: Number(a.partner_buy_in),
      input_modality: a.input_modality,
      usage_moments: a.usage_moments,
      // Open
      open_wish: a.open_wish.trim() || null,
      tape_recorder: a.tape_recorder.trim() || null,
      // Interview
      interview_willingness: a.interview_willingness,
      interview_email: (a.interview_willingness === 'yes' || a.interview_willingness === 'maybe')
        ? (a.interview_email.trim() || null) : null,
      // Demographics
      age_band: a.age_band, gender: a.gender,
      sexual_orientation: a.sexual_orientation || null,
      country: a.country,
      education: a.education || null,
      household_income: a.household_income || null,
      has_kids: a.has_kids || null,
      therapy_history: a.therapy_history || null,
      // Contact
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

  if (status === 'disqualified') {
    return (
      <div className="rs-thanks">
        <p className="rs-eyebrow" style={{ color: '#81b756' }}>THANK YOU</p>
        <h2 className="rs-thanks-title">Hey Otis is built for couples in long-term relationships.</h2>
        <p className="rs-thanks-sub">
          Your honesty matters. We&apos;re focused on partnered people for now, but
          we&apos;d still love to keep you in the loop.
          <br /><br />
          <a href="/#get-started">Join the waitlist →</a>
        </p>
      </div>
    );
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

  const worstOptions = STEPS.filter((s) => s.value !== a.maxdiff_best);
  const cur = CURRENCY_SYMBOL[a.price_currency] || '';

  return (
    <form className="rs-form" onSubmit={handleSubmit} noValidate>
      <div className="rs-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="rs-progress-bar" style={{ width: `${progress}%` }} />
        <span className="rs-progress-label">{progress}% complete</span>
      </div>

      {/* CONSENT (no questions, just context) */}
      <div className="rs-consent">
        <p className="rs-eyebrow" style={{ color: '#4a7a23' }}>BEFORE YOU START</p>
        <h2 className="rs-consent-title">Thank you for taking 8 minutes for this.</h2>
        <p>
          The questions ask about your relationship and how you handle conflict. Some are personal.
          All your answers are anonymous and will only be used to shape Hey Otis. You can leave any
          optional question blank, or close the tab at any point. Your answers are not saved until
          you submit.
        </p>
      </div>

      {/* SECTION 1 — SCREEN */}
      <Section eyebrow="01 · QUICK SCREEN" title="A few quick ones to start.">
        <Choices dataKey="relationship_status" label="What best describes your current relationship?"
          choices={RELATIONSHIP_STATUS} value={a.relationship_status}
          onChange={(v) => set('relationship_status', v)} />
        {isDisqualified && (
          <p className="rs-disq">
            Hey Otis is built for couples. We&apos;re going to keep this short for you, but you&apos;re
            welcome to join the waitlist below.
          </p>
        )}
        {!isDisqualified && (
          <>
            <Choices dataKey="relationship_length" label="How long have you been together?"
              choices={REL_LENGTH} value={a.relationship_length}
              onChange={(v) => set('relationship_length', v)} />
            <Choices dataKey="unresolved_count_30d"
              label="In the past 30 days, how many disagreements did you have that didn't fully resolve?"
              choices={UNRESOLVED_COUNT} value={a.unresolved_count_30d}
              onChange={(v) => set('unresolved_count_30d', v)} />
            <Choices dataKey="conflict_frequency"
              label="How often does conflict in your relationship happen?"
              choices={FREQUENCY} value={a.conflict_frequency}
              onChange={(v) => set('conflict_frequency', v)} />
            <Choices dataKey="abusive_relationship"
              label="One sensitive question: have you ever experienced or are you currently in an emotionally or physically abusive relationship?"
              choices={ABUSIVE} value={a.abusive_relationship}
              onChange={(v) => set('abusive_relationship', v)} />
          </>
        )}
      </Section>

      {!isDisqualified && (
        <>
          {/* SECTION 2 — TOOLS YOU CURRENTLY USE */}
          <Section eyebrow="02 · WHAT YOU'VE TRIED" title="What you currently reach for.">
            <Multi dataKey="tools_reached_for"
              label="In the past year, which of these have you used to help with relationship conflict?"
              choices={TOOLS} values={a.tools_reached_for}
              onToggle={(v) => toggleMulti('tools_reached_for', v)} />
            <Multi dataKey="ai_usage_for_emotional"
              label="In the past 90 days, have you used ChatGPT, Claude, or another AI chatbot for any of these?"
              choices={AI_USAGE_FOR} values={a.ai_usage_for_emotional}
              onToggle={(v) => toggleMulti('ai_usage_for_emotional', v)} />
            <div className="rs-q">
              <label className="rs-q-label">If you used AI for any of the above, what worked, and what felt off about it? (optional)</label>
              <textarea className="rs-textarea" rows={3} value={a.ai_usage_what_worked}
                onChange={(e) => set('ai_usage_what_worked', e.target.value)}
                placeholder="Be honest. The off bits are the most useful." maxLength={500} />
            </div>
          </Section>

          {/* SECTION 3 — LAST CONFLICT */}
          <Section eyebrow="03 · YOUR LAST CONFLICT" title="Think about the most recent fight you had.">
            <div className="rs-q" data-q="last_conflict_about">
              <label className="rs-q-label">In one line, what was it about?</label>
              <textarea className="rs-textarea" rows={2} value={a.last_conflict_about}
                onChange={(e) => set('last_conflict_about', e.target.value)}
                placeholder="Two or three words is fine. Money. The dishes. His mum." maxLength={200} required />
            </div>
            <Choices dataKey="last_conflict_when" label="When was it?"
              choices={LAST_CONFLICT_WHEN} value={a.last_conflict_when}
              onChange={(v) => set('last_conflict_when', v)} />
            <Multi dataKey="first_30_min_actions"
              label="What did you do in the first 30 minutes after?"
              choices={FIRST_30} values={a.first_30_min_actions}
              onToggle={(v) => toggleMulti('first_30_min_actions', v)} />
            <Choices dataKey="did_resolve" label="Did you ever go back and resolve it?"
              choices={RESOLVED} value={a.did_resolve} onChange={(v) => set('did_resolve', v)} />
          </Section>

          {/* SECTION 4 — CONCEPT */}
          <Section eyebrow="04 · THE CONCEPT" title="Read this, then react.">
            <div className="rs-concept">
              <p>
                <strong>Hey Otis</strong> is a private, in-the-moment guide for couples in conflict.
              </p>
              <p>
                Through short assessments, it learns your love language, attachment style, conflict
                patterns, and core needs, and your partner&apos;s, if they join. Then in the hard
                moments, it walks you through four steps: <strong>vent</strong> what you&apos;re
                feeling, <strong>understand</strong> what&apos;s really going on underneath,{' '}
                <strong>prepare</strong> the right words, and <strong>nurture</strong> the actual
                conversation back together.
              </p>
              <p>
                Use it solo, or sync with your partner. Private. EU-built. Never trained on your data.
              </p>
            </div>
            <Choices dataKey="concept_appeal" label="How appealing does this sound?"
              choices={APPEAL_7} value={a.concept_appeal} onChange={(v) => set('concept_appeal', v)} />
            <Choices dataKey="maxdiff_best"
              label="Of the four steps, which would have helped MOST in your most recent conflict?"
              choices={STEPS} value={a.maxdiff_best} onChange={(v) => {
                set('maxdiff_best', v);
                if (a.maxdiff_worst === v) set('maxdiff_worst', '');
              }} />
            <Choices dataKey="maxdiff_worst" label="And which would have helped LEAST?"
              choices={worstOptions} value={a.maxdiff_worst}
              onChange={(v) => set('maxdiff_worst', v)} />
            <Choices dataKey="mode_preference" label="Would you want it just for you, your partner too, or synced from the start?"
              choices={MODE} value={a.mode_preference} onChange={(v) => set('mode_preference', v)} />
            <div className="rs-q" data-q="usage_blockers">
              <label className="rs-q-label">What would stop you from using something like this in a real conflict?</label>
              <textarea className="rs-textarea" rows={3} value={a.usage_blockers}
                onChange={(e) => set('usage_blockers', e.target.value)}
                placeholder="Be honest. The hardest answers are the most useful." maxLength={300} required />
            </div>
            <div className="rs-q">
              <label className="rs-q-label">What would make you trust an app like this enough to use it during a fight? (optional)</label>
              <textarea className="rs-textarea" rows={3} value={a.trust_requirement}
                onChange={(e) => set('trust_requirement', e.target.value)}
                placeholder="The thing that has to be true for you to open it." maxLength={400} />
            </div>
          </Section>

          {/* SECTION 5 — CSI-4 */}
          <Section eyebrow="05 · YOUR RELATIONSHIP" title="Four quick questions about how things feel overall.">
            <Choices dataKey="csi_happiness" label="All things considered, how happy is your relationship?"
              choices={CSI_HAPPINESS} value={a.csi_happiness}
              onChange={(v) => set('csi_happiness', v)} />
            <Choices dataKey="csi_going_well"
              label="In general, how often do things between you and your partner go well?"
              choices={CSI_GOING_WELL} value={a.csi_going_well}
              onChange={(v) => set('csi_going_well', v)} />
            <Choices dataKey="csi_strong" label='&ldquo;Our relationship is strong.&rdquo;'
              choices={CSI_TRUE} value={a.csi_strong} onChange={(v) => set('csi_strong', v)} />
            <Choices dataKey="csi_warm" label='&ldquo;I have a warm and comfortable relationship with my partner.&rdquo;'
              choices={CSI_TRUE} value={a.csi_warm} onChange={(v) => set('csi_warm', v)} />
          </Section>

          {/* SECTION 6 — PRICING + PRODUCT */}
          <Section eyebrow="06 · PRICING & FIT" title="Imagine Hey Otis exists today.">
            <Choices dataKey="price_currency" label="Answer the next four in your local currency:"
              choices={CURRENCIES} value={a.price_currency}
              onChange={(v) => set('price_currency', v)} />
            <PriceQ dataKey="vw_too_cheap" symbol={cur}
              label="At what monthly price would this feel SO CHEAP that you&apos;d question whether it actually works?"
              value={a.vw_too_cheap} onChange={(v) => set('vw_too_cheap', v)} />
            <PriceQ dataKey="vw_bargain" symbol={cur}
              label="At what monthly price would this feel like a BARGAIN, a great deal for the value?"
              value={a.vw_bargain} onChange={(v) => set('vw_bargain', v)} />
            <PriceQ dataKey="vw_expensive" symbol={cur}
              label="At what monthly price would this feel EXPENSIVE, but still worth considering?"
              value={a.vw_expensive} onChange={(v) => set('vw_expensive', v)} />
            <PriceQ dataKey="vw_too_expensive" symbol={cur}
              label="At what monthly price would it be SO EXPENSIVE that you&apos;d definitely not buy it?"
              value={a.vw_too_expensive} onChange={(v) => set('vw_too_expensive', v)} />
            <Choices dataKey="pricing_model_preference"
              label="Which pricing model would feel most natural? (optional)"
              choices={PRICING_MODEL} value={a.pricing_model_preference}
              onChange={(v) => set('pricing_model_preference', v)} />
            <Choices dataKey="partner_buy_in"
              label="If you used Hey Otis and found it useful, how likely is your partner to try it too?"
              choices={PARTNER_BUY_IN} value={a.partner_buy_in}
              onChange={(v) => set('partner_buy_in', v)} />
            <Choices dataKey="input_modality" label="Would you prefer to type, talk (voice), or both?"
              choices={INPUT_MODALITY} value={a.input_modality}
              onChange={(v) => set('input_modality', v)} />
            <Multi dataKey="usage_moments"
              label="When are the moments you&apos;d reach for something like this?"
              choices={USAGE_MOMENTS} values={a.usage_moments}
              onToggle={(v) => toggleMulti('usage_moments', v)} />
          </Section>

          {/* SECTION 7 — OPEN + INTERVIEW */}
          <Section eyebrow="07 · IN YOUR OWN WORDS" title="The most useful answers we get.">
            <div className="rs-q">
              <label className="rs-q-label">If you could change one thing about how you and your partner handle hard moments, what would it be? (optional)</label>
              <textarea className="rs-textarea" rows={4} value={a.tape_recorder}
                onChange={(e) => set('tape_recorder', e.target.value)}
                placeholder="There&apos;s no wrong answer." maxLength={600} />
            </div>
            <div className="rs-q">
              <label className="rs-q-label">What do you wish someone was building for couples in conflict? (optional)</label>
              <textarea className="rs-textarea" rows={3} value={a.open_wish}
                onChange={(e) => set('open_wish', e.target.value)}
                placeholder="Dream a little. We&apos;re listening." maxLength={1000} />
            </div>
            <Choices dataKey="interview_willingness"
              label="We&apos;d love to talk to a few people for 30 minutes about this. Would you be open?"
              choices={INTERVIEW} value={a.interview_willingness}
              onChange={(v) => set('interview_willingness', v)} />
            {(a.interview_willingness === 'yes' || a.interview_willingness === 'maybe') && (
              <div className="rs-q">
                <label className="rs-q-label">Email for the interview? (only used to schedule)</label>
                <input type="email" className="rs-input" value={a.interview_email}
                  onChange={(e) => set('interview_email', e.target.value)}
                  placeholder="you@example.com" autoComplete="email" />
              </div>
            )}
          </Section>

          {/* SECTION 8 — DEMOGRAPHICS */}
          <Section eyebrow="08 · ABOUT YOU" title="Last few. Helps us see patterns across people.">
            <Choices dataKey="age_band" label="Age" choices={AGE} value={a.age_band}
              onChange={(v) => set('age_band', v)} />
            <Choices dataKey="gender" label="Gender" choices={GENDER} value={a.gender}
              onChange={(v) => set('gender', v)} />
            <Choices dataKey="sexual_orientation" label="Sexual orientation (optional)"
              choices={ORIENTATION} value={a.sexual_orientation}
              onChange={(v) => set('sexual_orientation', v)} />
            <Choices dataKey="country" label="Country you live in" choices={COUNTRIES}
              value={a.country} onChange={(v) => set('country', v)} />
            <Choices dataKey="education" label="Highest level of education (optional)"
              choices={EDUCATION} value={a.education} onChange={(v) => set('education', v)} />
            <Choices dataKey="household_income"
              label="Approximate household income, annual (optional)"
              choices={INCOME} value={a.household_income}
              onChange={(v) => set('household_income', v)} />
            <Choices dataKey="has_kids" label="Do you have children at home? (optional)"
              choices={KIDS} value={a.has_kids} onChange={(v) => set('has_kids', v)} />
            <Choices dataKey="therapy_history" label="Have you ever attended therapy? (optional)"
              choices={THERAPY_HISTORY} value={a.therapy_history}
              onChange={(v) => set('therapy_history', v)} />
          </Section>
        </>
      )}

      {/* SECTION 9 — EMAIL */}
      <Section eyebrow="09 · STAY IN TOUCH" title="Optional. Only if you want updates.">
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
        <button type="submit" className="btn-primary btn-lg rs-submit"
          disabled={status === 'sending'}>
          {status === 'sending' ? 'Submitting…'
            : isDisqualified ? 'Submit (short version)'
            : 'Submit answers'}
        </button>
        {message && status === 'error' && (<p className="rs-msg rs-msg--error">{message}</p>)}
        <p className="rs-fineprint">
          Your answers help us build something better. We&apos;ll never sell your data.
        </p>
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

function PriceQ({ dataKey, label, symbol, value, onChange }:
  { dataKey: string; label: string; symbol: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="rs-q" data-q={dataKey}>
      <label className="rs-q-label" dangerouslySetInnerHTML={{ __html: label }} />
      <div className="rs-price-row">
        <span className="rs-price-cur">{symbol || '#'}</span>
        <input type="text" inputMode="decimal" className="rs-input rs-price-input"
          value={value} onChange={(e) => onChange(e.target.value)} placeholder="0.00" />
        <span className="rs-price-suffix">/ month</span>
      </div>
    </div>
  );
}
