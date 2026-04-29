'use client';

import { useEffect, useMemo, useState, FormEvent } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/research-export?table=research_responses_v2`;
const STORAGE_KEY = 'heyotis_dashboard_pw';

type Row = {
  id: number;
  created_at: string;
  // screening
  in_long_term_relationship: boolean | null;
  recent_unresolved: boolean | null;
  conflict_frequency: string | null;
  relationship_length: string | null;
  relationship_status: string | null;
  unresolved_count_30d: string | null;
  abusive_relationship: string | null;
  // tools + AI
  tools_reached_for: string[] | null;
  ai_usage_for_emotional: string[] | null;
  ai_usage_what_worked: string | null;
  // behavioural
  last_conflict_about: string | null;
  last_conflict_when: string | null;
  first_30_min_actions: string[] | null;
  did_resolve: string | null;
  // CSI-4
  csi_happiness: number | null;
  csi_going_well: number | null;
  csi_strong: number | null;
  csi_warm: number | null;
  // concept
  concept_appeal: number | null;
  maxdiff_best: string | null;
  maxdiff_worst: string | null;
  usage_blockers: string | null;
  trust_requirement: string | null;
  mode_preference: string | null;
  // VW pricing + product
  price_currency: string | null;
  vw_too_cheap: number | null;
  vw_bargain: number | null;
  vw_expensive: number | null;
  vw_too_expensive: number | null;
  pricing_model_preference: string | null;
  partner_buy_in: number | null;
  input_modality: string | null;
  usage_moments: string[] | null;
  // open + interview
  open_wish: string | null;
  tape_recorder: string | null;
  interview_willingness: string | null;
  interview_email: string | null;
  // demographics
  age_band: string | null;
  gender: string | null;
  sexual_orientation: string | null;
  country: string | null;
  education: string | null;
  household_income: string | null;
  has_kids: string | null;
  therapy_history: string | null;
  // contact
  email: string | null;
  wants_early_access: boolean | null;
  referrer: string | null;
  user_agent: string | null;
};

type State = 'idle' | 'loading' | 'authed' | 'error';

const LABELS: Record<string, Record<string, string>> = {
  relationship_status: { married: 'Married/civil', lt_living: 'LT, living together', lt_apart: 'LT, apart', newer: '<1yr', single: 'Single' },
  conflict_frequency: { daily: 'Daily', several_week: 'Several/wk', weekly: 'Weekly', monthly: 'A few/mo', few_times_year: 'A few/yr', rarely: 'Rarely' },
  relationship_length: { lt_1: '<1 yr', '1_3': '1–3 yrs', '3_7': '3–7 yrs', '7_15': '7–15 yrs', '15_plus': '15+ yrs', '7_plus': '7+ yrs (legacy)' },
  unresolved_count_30d: { none: 'None', '1': '1', '2_3': '2–3', '4_6': '4–6', more_6: '6+' },
  abusive_relationship: { no: 'No', past: 'Past', currently: 'Currently', prefer_not: 'Prefer not' },
  did_resolve: { yes_fully: 'Fully', yes_days: 'Took days', partially: 'Partially', still: 'Still working', dropped: 'Dropped', yes: 'Fully (legacy)', no: 'Dropped (legacy)' },
  last_conflict_when: { today: 'Today', past_week: 'Past week', '2_4_weeks': '2–4 wks', '1_3_months': '1–3 mo', longer: 'Longer ago' },
  first_30_min_actions: { shut_down: 'Shut down', yelled: 'Argued more', cried: 'Cried', walked_out: 'Walked out', vented_friend: 'Vented to friend', texted_partner: 'Texted partner', googled: 'Googled', journaled: 'Journaled', talked_partner: 'Talked it out', slept: 'Slept on it', used_ai: 'Used AI', drink_med: 'Drink/med', other: 'Other' },
  tools_reached_for: { couples_therapy: 'Couples therapy', individual_therapy: 'Own therapist', therapy: 'Therapy (legacy)', self_help: 'Self-help books', workbooks: 'Workbooks', apps: 'Apps', ai_chat: 'AI chat', podcasts: 'Podcasts', social: 'Social media', friends: 'Friends/family', helpline: 'Helpline', religious: 'Religious', coach: "Coach/mediator", nothing: 'Nothing' },
  ai_usage_for_emotional: { draft_message: 'Drafting messages', talk_through_fight: 'Talking through fight', understand_partner: 'Understand partner', process_emotions: 'Process emotions', lookup_advice: 'Looking up advice', practise_conversation: 'Practising convo', never: 'Never used AI' },
  maxdiff_best: { vent: 'Vent', understand: 'Understand', prepare: 'Prepare', nurture: 'Nurture' },
  maxdiff_worst: { vent: 'Vent', understand: 'Understand', prepare: 'Prepare', nurture: 'Nurture' },
  mode_preference: { solo: 'Solo', partner: 'Partner', both: 'Both synced', start_solo: 'Start solo, see' },
  pricing_model_preference: { free_tier: 'Free + paid', sub_monthly: 'Monthly sub', sub_annual: 'Annual sub', one_time: 'One-time', couple_plan: 'Couple plan', pay_per_use: 'Pay per use' },
  input_modality: { type: 'Type', voice: 'Voice', both: 'Both', depends: 'Depends' },
  usage_moments: { late_night: 'Late night', right_after: 'Right after fight', next_morning: 'Next morning', weekend_am: 'Weekend AM', work_hours: 'Work hours', before_bed: 'Before bed', commute: 'Commute', other: 'Other' },
  interview_willingness: { yes: 'Yes', maybe: 'Maybe', no: 'No' },
  age_band: { lt_25: '<25', '25_34': '25–34', '35_44': '35–44', '45_54': '45–54', '55_64': '55–64', '65_plus': '65+', prefer_not: 'Prefer not' },
  gender: { woman: 'Woman', man: 'Man', nonbinary: 'Non-binary', other: 'Other', prefer_not: 'Prefer not' },
  sexual_orientation: { straight: 'Straight', gay: 'Gay/lesbian', bisexual: 'Bisexual', queer: 'Queer', other: 'Other', prefer_not: 'Prefer not' },
  education: { secondary: 'Secondary', some_uni: 'Some uni', bachelors: "Bachelor's", masters_phd: "Master's/PhD", trade: 'Trade', prefer_not: 'Prefer not' },
  household_income: { lt_30: '<€30k', '30_60': '€30–60k', '60_100': '€60–100k', '100_150': '€100–150k', '150_plus': '€150k+', prefer_not: 'Prefer not' },
  has_kids: { no: 'No', under_5: '<5', '5_12': '5–12', teens: 'Teens', adult_home: 'Adult at home', adult_left: 'Adult, left', prefer_not: 'Prefer not' },
  therapy_history: { never: 'Never', individual_only: 'Individual only', couples_now: 'Couples (now)', couples_past: 'Couples (past)', both: 'Both', prefer_not: 'Prefer not' },
};

function label(group: string, value: string) {
  return LABELS[group]?.[value] ?? value;
}

export default function DashboardV2() {
  const [pw, setPw] = useState('');
  const [state, setState] = useState<State>('idle');
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (cached) {
      setPw(cached);
      void fetchData(cached);
    }
  }, []);

  async function fetchData(password: string) {
    setState('loading');
    setErr('');
    try {
      const res = await fetch(FUNCTION_URL, {
        method: 'GET',
        headers: { 'X-Dashboard-Password': password },
      });
      if (res.status === 401) {
        sessionStorage.removeItem(STORAGE_KEY);
        setState('error');
        setErr('Wrong password.');
        return;
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setState('error');
        setErr(j.error || `Server error (${res.status}).`);
        return;
      }
      const json = await res.json();
      sessionStorage.setItem(STORAGE_KEY, password);
      setRows(json.rows || []);
      setState('authed');
    } catch {
      setState('error');
      setErr('Network error. Check your connection.');
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void fetchData(pw);
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setPw('');
    setRows([]);
    setState('idle');
  }

  if (state !== 'authed') {
    return (
      <main className="db-gate">
        <form className="db-gate-form" onSubmit={handleSubmit}>
          <p className="rs-eyebrow">HEY OTIS · V2</p>
          <h1 className="db-gate-title">Research v2 dashboard</h1>
          <input type="password" className="rs-input" placeholder="Password"
            value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
          <button type="submit" className="btn-primary btn-lg" disabled={state === 'loading' || !pw}>
            {state === 'loading' ? 'Checking…' : 'Enter'}
          </button>
          {err && <p className="rs-msg rs-msg--error" style={{ textAlign: 'center' }}>{err}</p>}
        </form>
      </main>
    );
  }

  return <DashboardView rows={rows} onLogout={logout} onRefresh={() => fetchData(pw)} />;
}

function DashboardView({ rows, onLogout, onRefresh }: { rows: Row[]; onLogout: () => void; onRefresh: () => void }) {
  const total = rows.length;

  // CSI-4 scoring (Funk & Rogge 2007): sum of 4 items, max 21. <13.5 = relationship distress
  const csi = useMemo(() => {
    const scores = rows
      .filter((r) => r.csi_happiness != null && r.csi_going_well != null && r.csi_strong != null && r.csi_warm != null)
      .map((r) => (r.csi_happiness! + r.csi_going_well! + r.csi_strong! + r.csi_warm!));
    if (!scores.length) return { avg: 0, distressed: 0, total: 0, distressedPct: 0 };
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const distressed = scores.filter((s) => s < 13.5).length;
    return { avg, distressed, total: scores.length, distressedPct: Math.round((distressed / scores.length) * 100) };
  }, [rows]);

  // Van Westendorp: average of each price for a quick read.
  // For a real PSM analysis you'd plot the four curves and find intersections —
  // that's a vis problem, not a number problem, so we surface the medians.
  const vw = useMemo(() => {
    function median(field: keyof Row): number | null {
      const vals = rows.map((r) => r[field] as number | null).filter((v): v is number => typeof v === 'number' && !isNaN(v));
      if (!vals.length) return null;
      const sorted = [...vals].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }
    return {
      tooCheap: median('vw_too_cheap'),
      bargain: median('vw_bargain'),
      expensive: median('vw_expensive'),
      tooExpensive: median('vw_too_expensive'),
    };
  }, [rows]);

  // Concept appeal (1-5 likert)
  const conceptAppealAvg = useMemo(() => {
    const vals = rows.map((r) => r.concept_appeal).filter((v): v is number => typeof v === 'number');
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  }, [rows]);

  // Single-select counts
  function single(field: keyof Row) {
    const counts = new Map<string, number>();
    rows.forEach((r) => {
      const v = r[field];
      if (typeof v === 'string' && v) counts.set(v, (counts.get(v) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }

  function multi(field: keyof Row) {
    const counts = new Map<string, number>();
    rows.forEach((r) => {
      const v = r[field];
      if (Array.isArray(v)) v.forEach((x) => counts.set(x, (counts.get(x) || 0) + 1));
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }

  // MaxDiff combined score: best - worst per step
  const maxdiff = useMemo(() => {
    const steps = ['vent', 'understand', 'prepare', 'nurture'];
    const best = new Map<string, number>();
    const worst = new Map<string, number>();
    rows.forEach((r) => {
      if (r.maxdiff_best) best.set(r.maxdiff_best, (best.get(r.maxdiff_best) || 0) + 1);
      if (r.maxdiff_worst) worst.set(r.maxdiff_worst, (worst.get(r.maxdiff_worst) || 0) + 1);
    });
    return steps.map((s) => ({
      step: s,
      best: best.get(s) || 0,
      worst: worst.get(s) || 0,
      net: (best.get(s) || 0) - (worst.get(s) || 0),
    })).sort((a, b) => b.net - a.net);
  }, [rows]);

  function exportCsv() {
    if (!rows.length) return;
    const cols = Object.keys(rows[0]);
    const escape = (v: unknown) => {
      if (v == null) return '';
      const s = Array.isArray(v) ? v.join('|') : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => escape((r as Record<string, unknown>)[c])).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research_v2_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="db-main">
      <header className="db-header">
        <div>
          <p className="rs-eyebrow" style={{ color: '#81b756' }}>HEY OTIS · V2 DASHBOARD</p>
          <h1 className="db-title">Research v2 responses</h1>
        </div>
        <div className="db-header-actions">
          <a href="/admin/research" className="btn-ghost" style={{ padding: '10px 16px', fontSize: 13 }}>← v1 dashboard</a>
          <button className="btn-ghost" onClick={onRefresh}>Refresh</button>
          <button className="btn-ghost" onClick={exportCsv} disabled={!rows.length}>Export CSV</button>
          <button className="btn-ghost" onClick={onLogout}>Log out</button>
        </div>
      </header>

      {/* Top stats */}
      <section className="db-stats">
        <Stat label="Total responses" value={total.toString()} />
        <Stat label="Email opt-ins" value={rows.filter((r) => r.wants_early_access).length.toString()} />
        <Stat label="Last response" value={total ? new Date(rows[0].created_at).toLocaleString() : '—'} small />
      </section>

      {/* CSI-4 — clinical insight */}
      <section className="db-card">
        <h2 className="db-card-title">CSI-4 — Couples Satisfaction Index (validated, Funk &amp; Rogge 2007)</h2>
        <div className="db-csi">
          <div className="db-csi-block">
            <p className="db-csi-num">{csi.avg ? csi.avg.toFixed(1) : '—'}<span> / 21</span></p>
            <p className="db-csi-l">Average score</p>
            <p className="db-csi-s">21 = perfect satisfaction</p>
          </div>
          <div className="db-csi-block db-csi-block--alert">
            <p className="db-csi-num">{csi.distressedPct}%<span></span></p>
            <p className="db-csi-l">Below distress threshold</p>
            <p className="db-csi-s">{csi.distressed} of {csi.total} respondents scored &lt;13.5 (clinical cutoff for relationship distress)</p>
          </div>
          <div className="db-csi-block">
            <p className="db-csi-num">{conceptAppealAvg ? conceptAppealAvg.toFixed(2) : '—'}<span> / 7</span></p>
            <p className="db-csi-l">Concept appeal</p>
            <p className="db-csi-s">Average rating (7-point scale)</p>
          </div>
        </div>
      </section>

      {/* Van Westendorp pricing */}
      <section className="db-card">
        <h2 className="db-card-title">Van Westendorp pricing — median monthly € (n = {rows.filter(r => r.vw_bargain != null).length})</h2>
        <div className="db-vw">
          <VWPrice label="Too cheap" sub="Quality doubt" value={vw.tooCheap} color="#f67700" />
          <VWPrice label="Bargain" sub="Sweet spot" value={vw.bargain} color="#4ea989" featured />
          <VWPrice label="Expensive but worth it" sub="Premium ceiling" value={vw.expensive} color="#92a6f4" />
          <VWPrice label="Too expensive" sub="Hard no" value={vw.tooExpensive} color="#bd57f2" />
        </div>
        <p className="db-empty" style={{ marginTop: 12, fontSize: 12 }}>
          Optimal price range typically sits between the &ldquo;bargain&rdquo; and &ldquo;expensive&rdquo; medians.
        </p>
      </section>

      {/* MaxDiff */}
      <section className="db-card">
        <h2 className="db-card-title">Which step would help most? (MaxDiff: net = best − worst)</h2>
        <ul className="db-bars">
          {maxdiff.map((m) => (
            <li key={m.step} className="db-bar-row">
              <span className="db-bar-label">{label('maxdiff_best', m.step)}</span>
              <div className="db-bar"><div className="db-bar-fill" style={{ width: `${Math.max(0, (m.net / Math.max(1, total)) * 100 + 50)}%` }} /></div>
              <span className="db-bar-value">net {m.net >= 0 ? '+' : ''}{m.net}  ({m.best}↑ / {m.worst}↓)</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Partner buy-in (viral coefficient) */}
      <section className="db-card">
        <h2 className="db-card-title">Partner buy-in (viral coefficient signal)</h2>
        <PartnerBuyIn rows={rows} />
      </section>

      {/* AI usage (the wedge data) */}
      <div className="db-grid">
        <BarCard title="What people use AI for in conflict (multi)" data={multi('ai_usage_for_emotional')} group="ai_usage_for_emotional" total={total} />
        <BarCard title="Pricing model preference" data={single('pricing_model_preference')} group="pricing_model_preference" total={total} />
      </div>

      <div className="db-grid">
        <BarCard title="Preferred input modality" data={single('input_modality')} group="input_modality" total={total} />
        <BarCard title="When they'd reach for it (multi)" data={multi('usage_moments')} group="usage_moments" total={total} />
      </div>

      {/* Email opt-ins */}
      <EmailList rows={rows} />

      {/* Interview pipeline */}
      <InterviewList rows={rows} />

      {/* Single-select bars */}
      <div className="db-grid">
        <BarCard title="Relationship status" data={single('relationship_status')} group="relationship_status" total={total} />
        <BarCard title="Relationship length" data={single('relationship_length')} group="relationship_length" total={total} />
        <BarCard title="Conflict frequency" data={single('conflict_frequency')} group="conflict_frequency" total={total} />
        <BarCard title="Unresolved last 30d" data={single('unresolved_count_30d')} group="unresolved_count_30d" total={total} />
        <BarCard title="When the last fight was" data={single('last_conflict_when')} group="last_conflict_when" total={total} />
        <BarCard title="Did the last fight resolve?" data={single('did_resolve')} group="did_resolve" total={total} />
        <BarCard title="Mode preference" data={single('mode_preference')} group="mode_preference" total={total} />
        <BarCard title="Abuse screen flag" data={single('abusive_relationship')} group="abusive_relationship" total={total} />
      </div>

      {/* Demographics */}
      <div className="db-grid">
        <BarCard title="Age" data={single('age_band')} group="age_band" total={total} />
        <BarCard title="Gender" data={single('gender')} group="gender" total={total} />
        <BarCard title="Country" data={single('country')} group="country" total={total} />
        <BarCard title="Sexual orientation" data={single('sexual_orientation')} group="sexual_orientation" total={total} />
        <BarCard title="Education" data={single('education')} group="education" total={total} />
        <BarCard title="Household income" data={single('household_income')} group="household_income" total={total} />
        <BarCard title="Children at home" data={single('has_kids')} group="has_kids" total={total} />
        <BarCard title="Therapy history" data={single('therapy_history')} group="therapy_history" total={total} />
      </div>

      {/* Multi-select */}
      <div className="db-grid">
        <BarCard title="What they did in first 30 min (multi)" data={multi('first_30_min_actions')} group="first_30_min_actions" total={total} />
        <BarCard title="Tools they reached for (multi)" data={multi('tools_reached_for')} group="tools_reached_for" total={total} />
      </div>

      {/* Open text */}
      <section className="db-card">
        <h2 className="db-card-title">What was your last fight about? (1-line recall)</h2>
        <div className="db-quotes">
          {rows.filter((r) => r.last_conflict_about).map((r) => (
            <blockquote key={`c-${r.id}`} className="db-quote">
              <p>{r.last_conflict_about}</p>
              <cite>{label('did_resolve', r.did_resolve || '')} · {new Date(r.created_at).toLocaleDateString()}</cite>
            </blockquote>
          ))}
          {!rows.some((r) => r.last_conflict_about) && <p className="db-empty">No open responses yet.</p>}
        </div>
      </section>

      <section className="db-card">
        <h2 className="db-card-title">What would stop you from using it?</h2>
        <div className="db-quotes">
          {rows.filter((r) => r.usage_blockers).map((r) => (
            <blockquote key={`b-${r.id}`} className="db-quote">
              <p>{r.usage_blockers}</p>
              <cite>{new Date(r.created_at).toLocaleDateString()}</cite>
            </blockquote>
          ))}
          {!rows.some((r) => r.usage_blockers) && <p className="db-empty">No open responses yet.</p>}
        </div>
      </section>

      <section className="db-card">
        <h2 className="db-card-title">What would make you trust it?</h2>
        <div className="db-quotes">
          {rows.filter((r) => r.trust_requirement).map((r) => (
            <blockquote key={`tr-${r.id}`} className="db-quote">
              <p>{r.trust_requirement}</p>
              <cite>{new Date(r.created_at).toLocaleDateString()}</cite>
            </blockquote>
          ))}
          {!rows.some((r) => r.trust_requirement) && <p className="db-empty">No open responses yet.</p>}
        </div>
      </section>

      <section className="db-card">
        <h2 className="db-card-title">If you could change one thing about how you handle hard moments…</h2>
        <div className="db-quotes">
          {rows.filter((r) => r.tape_recorder).map((r) => (
            <blockquote key={`tape-${r.id}`} className="db-quote">
              <p>{r.tape_recorder}</p>
              <cite>{new Date(r.created_at).toLocaleDateString()}</cite>
            </blockquote>
          ))}
          {!rows.some((r) => r.tape_recorder) && <p className="db-empty">No open responses yet.</p>}
        </div>
      </section>

      <section className="db-card">
        <h2 className="db-card-title">What worked / felt off about using AI for this?</h2>
        <div className="db-quotes">
          {rows.filter((r) => r.ai_usage_what_worked).map((r) => (
            <blockquote key={`ai-${r.id}`} className="db-quote">
              <p>{r.ai_usage_what_worked}</p>
              <cite>{new Date(r.created_at).toLocaleDateString()}</cite>
            </blockquote>
          ))}
          {!rows.some((r) => r.ai_usage_what_worked) && <p className="db-empty">No open responses yet.</p>}
        </div>
      </section>

      <section className="db-card">
        <h2 className="db-card-title">What do you wish someone was building?</h2>
        <div className="db-quotes">
          {rows.filter((r) => r.open_wish).map((r) => (
            <blockquote key={`w-${r.id}`} className="db-quote">
              <p>{r.open_wish}</p>
              <cite>{new Date(r.created_at).toLocaleDateString()}</cite>
            </blockquote>
          ))}
          {!rows.some((r) => r.open_wish) && <p className="db-empty">No open responses yet.</p>}
        </div>
      </section>

      {/* Referrers */}
      <section className="db-card">
        <h2 className="db-card-title">Where they came from (paid + organic)</h2>
        <BarCard data={single('referrer')} group="referrer" total={total} flat />
      </section>
    </main>
  );
}

function EmailList({ rows }: { rows: Row[] }) {
  const withEmail = rows.filter((r) => r.email);
  const optIns = withEmail.filter((r) => r.wants_early_access);

  function copyAll(list: Row[]) {
    const text = list.map((r) => r.email).join(', ');
    navigator.clipboard?.writeText(text);
  }

  return (
    <section className="db-card">
      <div className="db-emails-head">
        <h2 className="db-card-title" style={{ marginBottom: 0 }}>Emails ({withEmail.length} total · {optIns.length} opted-in)</h2>
        {withEmail.length > 0 && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" style={{ padding: '8px 14px', fontSize: 12 }} onClick={() => copyAll(withEmail)}>Copy all</button>
            <button className="btn-ghost" style={{ padding: '8px 14px', fontSize: 12 }} onClick={() => copyAll(optIns)} disabled={!optIns.length}>Copy opted-in</button>
          </div>
        )}
      </div>
      {withEmail.length === 0 ? (
        <p className="db-empty">No emails submitted yet.</p>
      ) : (
        <ul className="db-email-list">
          {withEmail.map((r) => (
            <li key={`e-${r.id}`} className="db-email-row">
              <a href={`mailto:${r.email}`}>{r.email}</a>
              {r.wants_early_access && <span className="db-pill db-pill--green">early access</span>}
              <span className="db-email-meta">{new Date(r.created_at).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="db-stat">
      <p className={`db-stat-value ${small ? 'db-stat-value--sm' : ''}`}>{value}</p>
      <p className="db-stat-label">{label}</p>
    </div>
  );
}

function PartnerBuyIn({ rows }: { rows: Row[] }) {
  const vals = rows.map((r) => r.partner_buy_in).filter((v): v is number => typeof v === 'number');
  const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  const high = vals.filter((v) => v >= 4).length;
  const highPct = vals.length ? Math.round((high / vals.length) * 100) : 0;
  return (
    <div className="db-csi">
      <div className="db-csi-block">
        <p className="db-csi-num">{vals.length ? avg.toFixed(2) : '—'}<span> / 5</span></p>
        <p className="db-csi-l">Avg partner buy-in</p>
        <p className="db-csi-s">Predicts solo → couple-tier conversion</p>
      </div>
      <div className="db-csi-block db-csi-block--alert">
        <p className="db-csi-num">{highPct}%<span></span></p>
        <p className="db-csi-l">Said partner would &ldquo;probably&rdquo; or &ldquo;definitely&rdquo;</p>
        <p className="db-csi-s">{high} of {vals.length} rated 4–5. The viral coefficient signal.</p>
      </div>
      <div className="db-csi-block">
        <p className="db-csi-num">{vals.filter((v) => v <= 2).length}<span></span></p>
        <p className="db-csi-l">Rated 1–2 (won&apos;t bring partner)</p>
        <p className="db-csi-s">These respondents must be served well in solo mode</p>
      </div>
    </div>
  );
}

function InterviewList({ rows }: { rows: Row[] }) {
  const yes = rows.filter((r) => r.interview_willingness === 'yes' && r.interview_email);
  const maybe = rows.filter((r) => r.interview_willingness === 'maybe' && r.interview_email);

  function copyEmails(list: Row[]) {
    const text = list.map((r) => r.interview_email).join(', ');
    navigator.clipboard?.writeText(text);
  }

  return (
    <section className="db-card">
      <div className="db-emails-head">
        <h2 className="db-card-title" style={{ marginBottom: 0 }}>
          Interview pipeline ({yes.length} yes · {maybe.length} maybe)
        </h2>
        {yes.length > 0 && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" style={{ padding: '8px 14px', fontSize: 12 }} onClick={() => copyEmails(yes)}>
              Copy yes-list
            </button>
            <button className="btn-ghost" style={{ padding: '8px 14px', fontSize: 12 }} onClick={() => copyEmails([...yes, ...maybe])} disabled={!maybe.length}>
              Copy yes + maybe
            </button>
          </div>
        )}
      </div>
      {yes.length === 0 && maybe.length === 0 ? (
        <p className="db-empty">No interview opt-ins yet.</p>
      ) : (
        <ul className="db-email-list">
          {[...yes, ...maybe].map((r) => (
            <li key={`int-${r.id}`} className="db-email-row">
              <a href={`mailto:${r.interview_email}`}>{r.interview_email}</a>
              {r.interview_willingness === 'yes' ? (
                <span className="db-pill db-pill--green">yes</span>
              ) : (
                <span className="db-pill" style={{ background: '#fff4e6', color: '#a35200' }}>maybe</span>
              )}
              <span className="db-email-meta">
                {label('age_band', r.age_band || '')} · {label('gender', r.gender || '')} · {label('country', r.country || '')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function VWPrice({ label, sub, value, color, featured }: { label: string; sub: string; value: number | null; color: string; featured?: boolean }) {
  return (
    <div className={`db-vw-card ${featured ? 'db-vw-card--feat' : ''}`}>
      <p className="db-vw-amt" style={{ color }}>{value != null ? `€${value.toFixed(2)}` : '—'}</p>
      <p className="db-vw-l">{label}</p>
      <p className="db-vw-s">{sub}</p>
    </div>
  );
}

function BarCard({ title, data, group, total, flat }: { title?: string; data: [string, number][]; group: string; total: number; flat?: boolean }) {
  const max = Math.max(1, ...data.map(([, n]) => n));
  return (
    <section className={`db-card ${flat ? 'db-card--flat' : ''}`}>
      {title && <h2 className="db-card-title">{title}</h2>}
      {data.length === 0 ? (
        <p className="db-empty">No data yet.</p>
      ) : (
        <ul className="db-bars">
          {data.map(([k, n]) => (
            <li key={k} className="db-bar-row">
              <span className="db-bar-label">{label(group, k)}</span>
              <div className="db-bar"><div className="db-bar-fill" style={{ width: `${(n / max) * 100}%` }} /></div>
              <span className="db-bar-value">{n}{total ? ` (${Math.round((n / total) * 100)}%)` : ''}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
