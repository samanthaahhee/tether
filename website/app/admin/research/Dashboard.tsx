'use client';

import { useEffect, useMemo, useState, FormEvent } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/research-export`;
const STORAGE_KEY = 'heyotis_dashboard_pw';

type Row = {
  id: number;
  created_at: string;
  rel_length: string | null;
  rel_state: string | null;
  conflict_pattern: string | null;
  fight_topics: string[] | null;
  fights_resolved: string | null;
  talk_openly: number | null;
  hard_to_find_words: number | null;
  wish_partner_understood: number | null;
  has_tools_eq: number | null;
  knows_frameworks: string[] | null;
  knows_real_issue: string | null;
  therapy_status: string | null;
  therapy_helpfulness: string | null;
  therapy_frequency: string | null;
  therapy_blockers: string[] | null;
  used_ai_for_advice: string | null;
  comfort_sharing_ai: number | null;
  hardest_part: string | null;
  ideal_tool: string | null;
  email: string | null;
  wants_early_access: boolean | null;
  referrer: string | null;
  user_agent: string | null;
};

type State = 'idle' | 'loading' | 'authed' | 'error';

const LABELS: Record<string, Record<string, string>> = {
  rel_length: { lt_1: '<1 yr', '1_3': '1–3 yrs', '3_7': '3–7 yrs', '7_plus': '7+ yrs', single: 'Single' },
  rel_state: { thriving: 'Thriving', good_w_rough: 'Good w/ rough patches', struggling: 'Struggling', crisis: 'Crisis', unsure: 'Unsure' },
  conflict_pattern: { talk_calm: 'Talk calmly', argue_makeup: 'Argue then make up', one_shuts_down: 'One shuts down', avoid: 'Avoid', escalate: 'Escalates' },
  fight_topics: { communication: 'Communication', money: 'Money', sex_intimacy: 'Sex / intimacy', household: 'Household', time: 'Time + attention', parenting: 'Parenting', in_laws: 'In-laws', trust: 'Trust', future: 'Future plans', other: 'Other' },
  fights_resolved: { always: 'Almost always', sometimes: 'Sometimes', rarely: 'Rarely', never: 'Never (dropped)' },
  knows_frameworks: { attachment: 'Attachment', love_languages: 'Love languages', gottman: 'Gottman', nvc: 'NVC', none: 'None' },
  knows_real_issue: { always: 'Almost always', sometimes: 'Sometimes', rarely: 'Rarely', never: 'Never' },
  therapy_status: { currently: 'Currently', past: 'Past', no_open: 'No, open', no_closed: 'No, closed' },
  therapy_helpfulness: { very: 'Very', somewhat: 'Somewhat', not_really: 'Not really', made_worse: 'Made worse' },
  therapy_frequency: { weekly: 'Weekly', biweekly: 'Biweekly', monthly: 'Monthly', occasional: 'Occasional', stopped: 'Stopped' },
  therapy_blockers: { cost: 'Cost', partner_unwilling: 'Partner unwilling', dont_know_how: 'Don\u2019t know how', prefer_alone: 'Prefer alone', dont_believe: 'Don\u2019t believe', stigma: 'Stigma', time: 'No time', never_thought: 'Never thought of it' },
  used_ai_for_advice: { regularly: 'Regularly', tried: 'Tried 1-2x', never: 'Never (open)', no_way: 'Would never' },
};

function label(group: string, value: string) {
  return LABELS[group]?.[value] ?? value;
}

export default function Dashboard() {
  const [pw, setPw] = useState('');
  const [state, setState] = useState<State>('idle');
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState('');

  // Try cached password on mount
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
    } catch (e) {
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
          <p className="rs-eyebrow">HEY OTIS</p>
          <h1 className="db-gate-title">Research dashboard</h1>
          <input
            type="password"
            className="rs-input"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
          />
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

  // Likert averages
  const averages = useMemo(() => {
    const fields: (keyof Row)[] = ['talk_openly', 'hard_to_find_words', 'wish_partner_understood', 'has_tools_eq', 'comfort_sharing_ai'];
    const out: Record<string, number> = {};
    fields.forEach((f) => {
      const vals = rows.map((r) => r[f]).filter((v): v is number => typeof v === 'number');
      out[f] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    });
    return out;
  }, [rows]);

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
    a.download = `research_responses_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="db-main">
      <header className="db-header">
        <div>
          <p className="rs-eyebrow" style={{ color: '#81b756' }}>HEY OTIS · DASHBOARD</p>
          <h1 className="db-title">Research responses</h1>
        </div>
        <div className="db-header-actions">
          <button className="btn-ghost" onClick={onRefresh}>Refresh</button>
          <button className="btn-ghost" onClick={exportCsv} disabled={!rows.length}>Export CSV</button>
          <button className="btn-ghost" onClick={onLogout}>Log out</button>
        </div>
      </header>

      {/* Top stats */}
      <section className="db-stats">
        <Stat label="Total responses" value={total.toString()} />
        <Stat label="With email opt-in" value={rows.filter((r) => r.wants_early_access).length.toString()} />
        <Stat label="Last response" value={total ? new Date(rows[0].created_at).toLocaleString() : '—'} small />
      </section>

      {/* Likert averages */}
      <section className="db-card">
        <h2 className="db-card-title">Likert averages (1 = strongly disagree, 5 = strongly agree)</h2>
        <div className="db-likert-grid">
          <LikertBar label="I can talk openly with my partner" v={averages.talk_openly} />
          <LikertBar label="I struggle to find words mid-argument" v={averages.hard_to_find_words} />
          <LikertBar label="I wish my partner understood me more" v={averages.wish_partner_understood} />
          <LikertBar label="I have the EQ tools I need" v={averages.has_tools_eq} />
          <LikertBar label="I'd be comfortable sharing with AI" v={averages.comfort_sharing_ai} />
        </div>
      </section>

      {/* Single-select bars */}
      <div className="db-grid">
        <BarCard title="Relationship state" data={single('rel_state')} group="rel_state" total={total} />
        <BarCard title="Relationship length" data={single('rel_length')} group="rel_length" total={total} />
        <BarCard title="Conflict pattern" data={single('conflict_pattern')} group="conflict_pattern" total={total} />
        <BarCard title="Are fights resolved?" data={single('fights_resolved')} group="fights_resolved" total={total} />
        <BarCard title="Know real issue mid-fight?" data={single('knows_real_issue')} group="knows_real_issue" total={total} />
        <BarCard title="Used AI for relationship advice?" data={single('used_ai_for_advice')} group="used_ai_for_advice" total={total} />
        <BarCard title="Couples therapy status" data={single('therapy_status')} group="therapy_status" total={total} />
        <BarCard title="Therapy helpfulness (if did)" data={single('therapy_helpfulness')} group="therapy_helpfulness" total={rows.filter(r => r.therapy_helpfulness).length} />
      </div>

      {/* Multi-select */}
      <div className="db-grid">
        <BarCard title="Fight topics (multi)" data={multi('fight_topics')} group="fight_topics" total={total} />
        <BarCard title="Frameworks known (multi)" data={multi('knows_frameworks')} group="knows_frameworks" total={total} />
        <BarCard title="Therapy blockers (if didn't go)" data={multi('therapy_blockers')} group="therapy_blockers" total={rows.filter(r => r.therapy_blockers && r.therapy_blockers.length).length} />
      </div>

      {/* Open text */}
      <section className="db-card">
        <h2 className="db-card-title">Open responses · Hardest part of communicating</h2>
        <div className="db-quotes">
          {rows.filter((r) => r.hardest_part).map((r) => (
            <blockquote key={`h-${r.id}`} className="db-quote">
              <p>{r.hardest_part}</p>
              <cite>{label('rel_state', r.rel_state || '')} · {new Date(r.created_at).toLocaleDateString()}</cite>
            </blockquote>
          ))}
          {!rows.some((r) => r.hardest_part) && <p className="db-empty">No open responses yet.</p>}
        </div>
      </section>

      <section className="db-card">
        <h2 className="db-card-title">Open responses · If a tool could help, what would it do?</h2>
        <div className="db-quotes">
          {rows.filter((r) => r.ideal_tool).map((r) => (
            <blockquote key={`t-${r.id}`} className="db-quote">
              <p>{r.ideal_tool}</p>
              <cite>{label('rel_state', r.rel_state || '')} · {new Date(r.created_at).toLocaleDateString()}</cite>
            </blockquote>
          ))}
          {!rows.some((r) => r.ideal_tool) && <p className="db-empty">No open responses yet.</p>}
        </div>
      </section>

      {/* Referrers */}
      <section className="db-card">
        <h2 className="db-card-title">Where they came from</h2>
        <BarCard data={single('referrer')} group="referrer" total={total} flat />
      </section>
    </main>
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

function LikertBar({ label, v }: { label: string; v: number }) {
  const pct = (v / 5) * 100;
  return (
    <div className="db-likert-row">
      <span className="db-likert-label">{label}</span>
      <div className="db-likert-bar"><div className="db-likert-fill" style={{ width: `${pct}%` }} /></div>
      <span className="db-likert-value">{v ? v.toFixed(2) : '—'}</span>
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
