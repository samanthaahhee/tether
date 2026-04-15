'use client';

import { useState } from 'react';

const STEPS = [
  {
    key: 'vent',
    number: 1,
    title: 'Vent',
    subtitle: 'Let it all out',
    color: '#4ea989',
    body: "This space is yours alone. Say exactly what you're feeling, type it or use your voice. No one else will ever see this. Putting emotions into words reduces their intensity. Your mind shifts from reacting to reflecting.",
    image: '/step1-image.png',
  },
  {
    key: 'understand',
    number: 2,
    title: 'Understand',
    subtitle: "What's really going on?",
    color: '#92a6f4',
    body: "Most arguments aren't about what they seem. Beneath every conflict is usually an unmet need to feel safe, valued, or connected. Hey Otis helps you identify the real issue so you stop fighting about dishes and start addressing what actually matters.",
    image: '/step2-image.png',
  },
  {
    key: 'prepare',
    number: 3,
    title: 'Prepare',
    subtitle: 'Find the right words',
    color: '#f67700',
    body: "Research shows how you open a conversation determines how it ends 96% of the time. Hey Otis coaches you to frame what you want to say using observations, feelings, needs, and requests so your partner hears you, not an attack.",
    image: '/step3-image.png',
  },
  {
    key: 'nurture',
    number: 4,
    title: 'Nurture',
    subtitle: 'Have the conversation',
    color: '#bd57f2',
    body: "The conversation itself is the repair. Hey Otis gives you a step by step guide on how to open softly, what to say if things get heated, and how to close with gratitude. Even if you don't resolve everything, showing up with intention builds trust over time.",
    image: '/step4-image.png',
  },
];

export default function StepsSection() {
  const [openStep, setOpenStep] = useState(0);
  const step = STEPS[openStep];

  return (
    <section className="how-section" id="how">
      <div className="how-container">
      <div className="how-header">
        <p className="eyebrow">FROM RUPTURE TO REPAIR</p>
        <h2>Four steps. One conversation at a time.</h2>
        <p className="subtitle" style={{ margin: '0 auto' }}>
          When a conflict occurs, Hey Otis walks you through a guided journey, from the raw
          emotion of a fight to a conversation your partner can actually hear.
        </p>
      </div>

      <div className="how-layout">
        <div className="how-left">
          <p className="how-label">How does it work?</p>
          <div className="accordion">
            {STEPS.map((s, i) => {
              const isOpen = i === openStep;
              return (
                <div
                  key={s.key}
                  className={`accordion-item ${isOpen ? 'accordion-item--open' : ''}`}
                  style={{ '--step-color': s.color } as React.CSSProperties}
                >
                  <button className="accordion-trigger" onClick={() => setOpenStep(i)}>
                    <div className="accordion-left">
                      <span className="accordion-num" style={{ background: s.color }}>{s.number}</span>
                      <div>
                        <span className="accordion-step-label">STEP {s.number}</span>
                        <span className="accordion-title">{s.title}</span>
                      </div>
                    </div>
                    <span className="accordion-subtitle">{s.subtitle}</span>
                    <span className="accordion-toggle">{isOpen ? '\u2212' : '+'}</span>
                  </button>
                  <div className={`accordion-body ${isOpen ? 'accordion-body--open' : ''}`}>
                    <p>{s.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="how-right">
          <img
            src={step.image}
            alt={`Step ${step.number}: ${step.title}`}
            className="step-image"
            key={step.key}
          />
        </div>
      </div>
      </div>
    </section>
  );
}
