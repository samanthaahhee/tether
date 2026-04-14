'use client';

import { useState } from 'react';

const STEPS = [
  {
    key: 'vent',
    number: 1,
    title: 'Vent',
    subtitle: 'Let it all out',
    color: '#4ea989',
    body: "This space is yours alone. Say exactly what you're feeling \u2014 type it or use your voice. No one else will ever see this. Putting emotions into words reduces their intensity. Your mind shifts from reacting to reflecting.",
    screenshot: '/session-vent.png',
  },
  {
    key: 'understand',
    number: 2,
    title: 'Understand',
    subtitle: "What's really going on?",
    color: '#92a6f4',
    body: "Most arguments aren't about what they seem. Beneath every conflict is usually an unmet need: to feel safe, valued, or connected. This step helps you move past the surface trigger and identify what actually matters.",
    screenshot: '/session-understand.png',
  },
  {
    key: 'prepare',
    number: 3,
    title: 'Prepare',
    subtitle: 'Find the right words',
    color: '#f67700',
    body: "How you start a conversation usually determines how it ends. Hey Otis helps you frame what you want to say using observations, feelings, needs, and requests. The goal isn't to win \u2014 it's to be heard.",
    screenshot: '/session-prepare.png',
  },
  {
    key: 'nurture',
    number: 4,
    title: 'Nurture',
    subtitle: 'Have the conversation',
    color: '#bd57f2',
    body: "The conversation itself is the repair. This step gives you a guide: how to open softly, what to say if things get heated, and how to close with gratitude. Showing up with intention builds trust over time.",
    screenshot: '/session-nurture.png',
  },
];

export default function StepsSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="how-section" id="how">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 64px' }}>
          <p className="eyebrow">From rupture to repair</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>
            Four steps. One conversation at a time.
          </h2>
          <p className="subtitle" style={{ margin: '0 auto' }}>
            Hey Otis walks you through a guided journey &mdash; from the raw emotion
            of a fight to a conversation your partner can actually hear.
          </p>
        </div>

        <div className="accordion-layout">
          <div className="accordion">
            {STEPS.map((step, i) => {
              const isOpen = i === open;
              return (
                <div
                  key={step.key}
                  className={`accordion-item ${isOpen ? 'accordion-item--open' : ''}`}
                  style={{ '--step-color': step.color } as React.CSSProperties}
                >
                  <button
                    className="accordion-trigger"
                    onClick={() => setOpen(i)}
                  >
                    <div className="accordion-left">
                      <span className="accordion-num" style={{ background: step.color }}>
                        {step.number}
                      </span>
                      <div>
                        <span className="accordion-step-label">Step {step.number}</span>
                        <span className="accordion-title">{step.title}</span>
                      </div>
                    </div>
                    <span className="accordion-subtitle">{step.subtitle}</span>
                    <span className={`accordion-chevron ${isOpen ? 'accordion-chevron--open' : ''}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </span>
                  </button>
                  <div className={`accordion-body ${isOpen ? 'accordion-body--open' : ''}`}>
                    <p>{step.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="accordion-preview">
            <div className="phone-frame" key={STEPS[open].key}>
              <img src={STEPS[open].screenshot} alt={STEPS[open].title} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
