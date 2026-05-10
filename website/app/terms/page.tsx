import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — Hey Otis',
  description:
    'The terms governing your use of Hey Otis — a private AI-guided communication tool for couples in long-term relationships.',
};

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: 'Who we are',
    body: (
      <>
        <p>
          Hey Otis is operated by Hey Otis (10 8 City B.V.), a company registered in the Netherlands. Throughout these terms, &ldquo;we&rdquo;, &ldquo;us&rdquo;, and &ldquo;Hey Otis&rdquo; refer to that entity. &ldquo;You&rdquo; refers to the person using the Hey Otis app or this website.
        </p>
        <p>
          By creating an account or using Hey Otis, you agree to these Terms of Service (the &ldquo;Terms&rdquo;) and our <Link href="/privacy">Privacy Policy</Link>. If you don&apos;t agree, please don&apos;t use the service.
        </p>
      </>
    ),
  },
  {
    title: 'What Hey Otis is — and is not',
    body: (
      <>
        <p>
          Hey Otis is a <strong>private, AI-guided communication tool</strong> for adults in long-term romantic relationships. It supports you through guided steps for processing emotion, finding language, and preparing for difficult conversations with your partner.
        </p>
        <p>Hey Otis is <strong>not</strong>:</p>
        <ul>
          <li>A therapist, counsellor, psychologist, or licensed practitioner</li>
          <li>A diagnostic tool — it does not name, identify, or confirm any mental-health condition</li>
          <li>A medical device under EU MDR or FDA classification</li>
          <li>A crisis line or emergency response service</li>
          <li>A replacement for couples therapy, individual therapy, or any qualified human support</li>
          <li>A substitute for legal, medical, or financial advice</li>
          <li>A safety mediator for active or imminent abuse situations</li>
        </ul>
        <p>
          If you are in immediate danger or in crisis, please contact a qualified professional or call your local emergency number.
        </p>
      </>
    ),
  },
  {
    title: 'Eligibility',
    body: (
      <>
        <p>You must be at least 18 years old to use Hey Otis. By creating an account you confirm that:</p>
        <ul>
          <li>You are 18 or older</li>
          <li>The information you provide is accurate</li>
          <li>You agree to use Hey Otis lawfully and respectfully</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Your account',
    body: (
      <>
        <p>You are responsible for the security of your account and for all activity that occurs under it. Specifically:</p>
        <ul>
          <li>Choose a strong password and don&apos;t share it</li>
          <li>Tell us immediately if you suspect unauthorised access</li>
          <li>One account per person — don&apos;t share an account with another adult or your partner</li>
          <li>If you connect with a partner, both of you have separate accounts and your private content remains private</li>
        </ul>
        <p>You may delete your account at any time via Settings &rarr; Delete all my data.</p>
      </>
    ),
  },
  {
    title: 'Acceptable use',
    body: (
      <>
        <p>While using Hey Otis you agree NOT to:</p>
        <ul>
          <li>Use the service to harass, threaten, control, or coerce another person</li>
          <li>Attempt to extract your partner&apos;s private content or coach yourself to weaponise communication against them</li>
          <li>Submit content that is illegal, infringing, or violates third-party rights</li>
          <li>Reverse engineer, decompile, or attempt to extract our source code or AI prompts</li>
          <li>Use Hey Otis to spam, scrape, or build derivative AI training datasets</li>
          <li>Misrepresent yourself as another person</li>
          <li>Bypass or attempt to bypass our safety features (crisis detection, content filtering, etc.)</li>
        </ul>
        <p>We may suspend or terminate accounts that violate these rules.</p>
      </>
    ),
  },
  {
    title: 'AI-generated content',
    body: (
      <>
        <p>Hey Otis uses Anthropic&apos;s Claude AI to generate guidance during your sessions. You acknowledge that:</p>
        <ul>
          <li>AI responses are suggestions for self-reflection, not diagnoses, prescriptions, or professional advice</li>
          <li>AI can be wrong, biased, or incomplete; you should treat outputs as starting points, not authoritative answers</li>
          <li>You are responsible for the decisions you make in your relationship</li>
          <li>For trauma, self-harm, eating disorders, psychosis, abuse, substance dependence, medication, or any other matter that requires qualified human help, you must consult an appropriate licensed professional</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Subscriptions and payments',
    body: (
      <>
        <p>
          Hey Otis is currently <strong>free to use</strong>. We may introduce paid subscription features in the future. Any paid feature will:
        </p>
        <ul>
          <li>Be clearly labelled before you commit</li>
          <li>Show the price and renewal terms before you confirm</li>
          <li>Be subject to a separate subscription agreement that you must accept</li>
          <li>Be processed by the relevant app store (Apple App Store or Google Play) under their billing terms</li>
        </ul>
        <p>
          Refunds for in-app purchases are handled by the app store you bought through, in accordance with their refund policies and applicable consumer law.
        </p>
      </>
    ),
  },
  {
    title: 'Crisis safety',
    body: (
      <>
        <p>
          Hey Otis includes safety features that may interrupt your conversation if your input matches certain crisis patterns (suicide, self-harm, abuse, child safety, psychosis, substance crisis, eating-disorder crisis). When this happens, the AI is bypassed and you are shown helpline resources for your country.
        </p>
        <p>
          These safety features are best-effort, not guaranteed. They are <strong>not</strong> a substitute for emergency services or professional help. If you are in immediate danger, please contact your local emergency number or crisis helpline directly.
        </p>
      </>
    ),
  },
  {
    title: 'Intellectual property',
    body: (
      <>
        <p>
          Hey Otis (the app, the website, the brand, the design, the safety framework, the prompts, and the underlying code) is our intellectual property. You receive a personal, limited, non-exclusive, non-transferable licence to use the service for your own personal use.
        </p>
        <p>
          Content you create within Hey Otis (your messages, reflections, learnings) belongs to you. By using the service you grant us a limited licence to process your content as needed to provide the service (display it back to you, generate AI responses, summarise sessions). We do not use your content to train AI models. We do not sell your content.
        </p>
      </>
    ),
  },
  {
    title: 'Service availability and changes',
    body: (
      <>
        <p>We aim to keep Hey Otis running smoothly, but:</p>
        <ul>
          <li>We may need to suspend the service for maintenance, security, or upgrades — we&apos;ll try to give notice when possible</li>
          <li>We may modify, update, or discontinue features over time</li>
          <li>We may change these Terms; material changes will be communicated in-app and by email, with at least 30 days&apos; notice for significant changes</li>
          <li>If we discontinue the service, we&apos;ll give you reasonable notice and an opportunity to export your data</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Limitation of liability',
    body: (
      <>
        <p>
          To the fullest extent permitted by law, Hey Otis (and its directors, employees, contractors, and agents) is not liable for indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the service.
        </p>
        <p>
          Our total liability to you for any claim arising out of or relating to the service is limited to the amount you have paid us in the 12 months prior to the claim, or €100 if you have not paid us anything (whichever is greater).
        </p>
        <p>
          Nothing in these Terms limits liability that cannot be limited by law (including liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded under applicable law).
        </p>
      </>
    ),
  },
  {
    title: 'Termination',
    body: (
      <>
        <p>
          You can stop using Hey Otis at any time and delete your account via Settings &rarr; Delete all my data. We can suspend or terminate your account if you breach these Terms or use the service in a way that risks harm to you or others.
        </p>
        <p>
          If we terminate your account for cause, we&apos;ll explain why and (where reasonable) give you an opportunity to fix the issue first.
        </p>
      </>
    ),
  },
  {
    title: 'Governing law and disputes',
    body: (
      <>
        <p>
          These Terms are governed by the laws of the Netherlands. Any dispute arising out of or related to these Terms or your use of the service will first be addressed by good-faith negotiation. If unresolved within 60 days, the dispute will be brought before the competent court in Amsterdam, the Netherlands.
        </p>
        <p>
          If you are a consumer in the EU, you may also have the right to bring a claim in your country of residence under your local consumer-protection laws — these Terms do not waive that right.
        </p>
      </>
    ),
  },
  {
    title: 'Contact',
    body: (
      <>
        <p>
          For questions about these Terms, email <a href="mailto:hello@heyotis.app">hello@heyotis.app</a>.
        </p>
        <p>
          For privacy-related enquiries, see our <Link href="/privacy">Privacy Policy</Link> or email <a href="mailto:privacy@heyotis.app">privacy@heyotis.app</a>.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="doc-main">
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <Link href="/"><img src="/header-logo.png" alt="Hey Otis" className="nav-icon" /></Link>
          </div>
          <Link href="/" className="nav-cta">Back to site</Link>
        </div>
      </nav>

      <article className="doc-article">
        <header className="doc-header">
          <p className="doc-eyebrow">TERMS OF SERVICE</p>
          <h1 className="doc-h1">The terms governing your use of Hey Otis.</h1>
          <p className="doc-lede">
            Hey Otis is a private, AI-guided communication tool for couples in long-term
            relationships. These Terms set out what we provide, what we expect of you, and the
            limits of what Hey Otis can do.
          </p>
          <p className="doc-effective">Effective date: 8 April 2026</p>
        </header>

        <div className="doc-toc">
          <p className="doc-toc-label">CONTENTS</p>
          <ol>
            {SECTIONS.map((s, i) => (
              <li key={i}><a href={`#sec-${i}`}>{s.title}</a></li>
            ))}
          </ol>
        </div>

        {SECTIONS.map((section, i) => (
          <section key={i} id={`sec-${i}`} className="doc-section">
            <h2 className="doc-h2">{section.title}</h2>
            <div className="doc-body">{section.body}</div>
          </section>
        ))}

        <p className="doc-foot">
          See also: <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </article>

      <footer className="ft">
        <p className="ft-brand">Hey Otis</p>
        <p className="ft-disc">Hey Otis supports but does not replace professional therapy.</p>
        <p className="ft-copy">&copy; 2026 Hey Otis. All rights reserved. &nbsp;|&nbsp; <a href="mailto:privacy@heyotis.app">privacy@heyotis.app</a></p>
      </footer>
    </main>
  );
}
