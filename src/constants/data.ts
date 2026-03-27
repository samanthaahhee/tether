export const ATTACHMENT_LABELS: Record<string, string> = {
  secure: 'Secure',
  anxious: 'Anxious-preoccupied',
  avoidant: 'Dismissive-avoidant',
  disorganised: 'Disorganised',
};

export const LOVE_LABELS: Record<string, string> = {
  words: 'Words of affirmation',
  acts: 'Acts of service',
  touch: 'Physical touch',
  time: 'Quality time',
  gifts: 'Thoughtful gifts',
};

export const CONFLICT_LABELS: Record<string, string> = {
  criticise: 'Direct communicator',
  defensive: 'Self-protective',
  stonewall: 'Inward processor',
  peacekeep: 'Peace-keeper',
};

export const WINDOW_LABELS: Record<string, string> = {
  hyper: 'Floods — heart races',
  hypo: 'Freezes — goes blank',
  mixed: 'Varies by situation',
  regulated: 'Stays mostly regulated',
};

export const NEED_LABELS: Record<string, string> = {
  seen: 'To feel seen & understood',
  safe: 'To feel safe & secure',
  respected: 'To feel respected & valued',
  space: 'Space to process',
};

export const ATTACH_REVEALS: Record<string, { title: string; body: string }> = {
  secure: {
    title: 'You have a mostly secure attachment style',
    body: 'You can regulate yourself during conflict without losing the relationship in your mind. This is a real strength — you can often act as a stabilising anchor, even in hard moments.',
  },
  anxious: {
    title: 'You have an anxious attachment style',
    body: "Your nervous system is wired to notice signs of distance and reach out to close the gap. This isn't neediness — it's an attachment need. Understanding this changes how you see your own behaviour.",
  },
  avoidant: {
    title: 'You have a dismissive-avoidant attachment style',
    body: "You've learned that self-sufficiency is safe. Closeness can feel like a threat to your independence. This doesn't mean you don't care — it means your nervous system processes intimacy differently.",
  },
  disorganised: {
    title: 'You have a disorganised (fearful) attachment style',
    body: "You've experienced relationships as both a source of comfort and threat. This creates a push-pull pattern that can feel confusing even to you. With awareness, this style can shift dramatically.",
  },
};

export const CONFLICT_REVEALS: Record<string, { title: string; body: string }> = {
  criticise: {
    title: 'You tend toward criticism under pressure',
    body: 'When you feel unheard, you turn up the volume — sometimes aiming at the person rather than the problem. A complaint ("I felt hurt when...") opens doors; criticism ("You always...") closes them.',
  },
  defensive: {
    title: 'You tend toward defensiveness under pressure',
    body: "When you feel attacked, you build a case. This is understandable — but it signals to your partner that their concern isn't being received. Taking ownership of even a small piece breaks the cycle.",
  },
  stonewall: {
    title: 'You tend to stonewall under pressure',
    body: "Going quiet isn't indifference — it's usually flooding. Learning to say 'I need 20 minutes — I'm not leaving, I love you' changes everything.",
  },
  peacekeep: {
    title: 'You tend to keep the peace under pressure',
    body: "You'll do almost anything to lower the temperature — including swallowing your real feelings. Peace-keeping builds quiet resentment over time. Your feelings deserve to be in the room.",
  },
};

export const WINDOW_REVEALS: Record<string, { title: string; body: string }> = {
  hyper: {
    title: 'You tend to become hyperaroused in conflict',
    body: "Your body floods with energy — heart rate spikes, voice rises, thinking narrows. Tether will offer grounding tools proactively and help you recognise the early signs.",
  },
  hypo: {
    title: 'You tend to become hypoaroused in conflict',
    body: "Rather than flooding, you shut down. This is dissociation — a protection strategy, not weakness. Your nervous system needs gentle re-engagement, not more pressure.",
  },
  mixed: {
    title: 'Your response varies depending on context',
    body: "You can go either way — flooded or frozen. Tether will check in on how you're feeling in the moment to offer the right support each time.",
  },
  regulated: {
    title: 'You tend to stay regulated under pressure',
    body: "You can feel the heat without losing yourself. This is genuinely rare — it means you have more capacity than most to listen even when you're uncomfortable.",
  },
};

export const LOVE_REVEALS: Record<string, { title: string; body: string }> = {
  words: {
    title: 'Your primary love language is words of affirmation',
    body: "Explicit verbal appreciation and reassurance are what make you feel genuinely loved. When these go unspoken, you may feel invisible — even if your partner shows love in other ways.",
  },
  acts: {
    title: 'Your primary love language is acts of service',
    body: "Action speaks louder than words for you. When someone does something helpful unprompted, you feel deeply cared for.",
  },
  touch: {
    title: 'Your primary love language is physical touch',
    body: "Physical closeness is the clearest signal that you're loved and safe. Physical disconnection during conflict can feel like emotional rejection.",
  },
  time: {
    title: 'Your primary love language is quality time',
    body: "Undivided, genuine presence fills your cup. A partner on their phone in the same room can feel lonelier than being apart.",
  },
  gifts: {
    title: 'Your primary love language is thoughtful gifts',
    body: "It's not about materialism — it's about being held in someone's mind. A small thoughtful gesture says 'I thought of you.'",
  },
};

export const ATTACH_INSIGHTS: Record<string, string> = {
  secure: 'Your secure base means you have more capacity than most to stay present during conflict. The work for you is staying curious rather than comfortable.',
  anxious: "Your pattern is to reach out more when scared — which makes sense, but can push partners away. Naming the fear directly works far better than intensifying.",
  avoidant: "You protect yourself through distance, but connection requires some vulnerability. Learning to signal 'I need time, not distance' is the single most powerful shift available to you.",
  disorganised: 'Your nervous system learned that close relationships can be both safe and dangerous. The path forward is building predictability — for yourself and your partner.',
};

export const MODE_CONFIG = {
  vent: {
    label: 'Vent',
    emoji: '🌊',
    color: '#C17F5A',
    paleBg: '#F2DDD0',
    borderColor: '#E8A882',
    context: "This is completely private — your partner will never see this. Speak or type freely.",
    stepLabel: 'Step 1 of your journey',
    stepTitle: 'Vent — just let it out',
    stepDesc: "This space is yours alone. Say exactly what you are feeling — type it or use the mic. No one else will ever hear this.",
    nextMode: 'understand' as const,
    nextLabel: 'Ready to reflect? Try Understand',
    quickActions: ['I feel unheard', 'I feel invisible', 'I am so frustrated', 'I feel scared about us'],
    systemPrompt: `You are Tether's empathic listener in VENT mode.
RULES:
- Reflect feelings with deep empathy — 2-4 sentences ONLY
- NEVER give advice or suggest solutions
- NEVER say "have you tried"
- Ask ONE gentle question that invites more expression
- If flooding detected (always/never/hate), gently name it
- Warm, human, present.`,
  },
  understand: {
    label: 'Understand',
    emoji: '🔍',
    color: '#C4A248',
    paleBg: '#F5EDD0',
    borderColor: '#D4B46A',
    context: "Let's gently explore what might be underneath what happened.",
    stepLabel: 'Step 2 of your journey',
    stepTitle: 'Understand — what\'s really going on?',
    stepDesc: 'Explore the pattern beneath the conflict. What are you really needing?',
    nextMode: 'prepare' as const,
    nextLabel: 'Ready to act? Try Prepare',
    quickActions: ['What pattern am I in?', 'What was I really feeling?', 'Why does this keep happening?'],
    systemPrompt: `You are Tether's insight guide in UNDERSTAND mode.
RULES:
- Help them move from surface complaint to underlying attachment need
- Use EFT language: "Beneath this, there may be a deeper fear of..."
- Offer insights as hypotheses: "I wonder if..." "Does it resonate that..."
- 3-5 sentences. Warm, curious, non-judgmental.`,
  },
  prepare: {
    label: 'Prepare',
    emoji: '🌿',
    color: '#7E9E8C',
    paleBg: '#D8EAE2',
    borderColor: '#A8C4B4',
    context: "Let's build tools for a better conversation together.",
    stepLabel: 'Step 3 of your journey',
    stepTitle: 'Prepare — turn insight into action',
    stepDesc: 'Build your message, plan the conversation, find a repair attempt.',
    nextMode: 'bridge' as const,
    nextLabel: 'Ready to send? Move to Bridge',
    quickActions: ['Help me write a message', 'What is a repair attempt?', 'How do I start this conversation?'],
    systemPrompt: `You are Tether's communication coach in PREPARE mode.
RULES:
- Help construct NVC messages: Observation, Feeling, Need, Request
- Guide from interpretation to observation
- Suggest repair attempts matched to love language
- 3-5 sentences with structured examples.`,
  },
  bridge: {
    label: 'Nurture',
    emoji: '💛',
    color: '#7E9E8C',
    paleBg: '#D8EAE2',
    borderColor: '#A8C4B4',
    context: "Compose and send a calm, considered message to your partner.",
    stepLabel: 'Step 4 of your journey',
    stepTitle: 'Nurture — send a repair message',
    stepDesc: 'Use what you have learned to compose an NVC message and close the loop.',
    nextMode: null,
    nextLabel: null,
    quickActions: ['Help me refine my message', 'Suggest a repair attempt', 'Am I being fair?'],
    systemPrompt: `You are Tether's bridge coach in BRIDGE mode.
RULES:
- Help the user compose or refine their NVC message (Observation, Feeling, Need, Request)
- Reference what they explored in earlier steps
- Keep the message compassionate and specific
- Suggest the tone and words that match their partner's likely reception
- 2-4 sentences. Supportive, action-oriented.`,
  },
};

export type ModeKey = keyof typeof MODE_CONFIG;

export const DAILY_INSIGHTS = [
  "Conflict is not the enemy of love — disconnection is.",
  "The antidote to criticism is a gentle start-up: begin with 'I feel' rather than 'You always'.",
  "Repair attempts during conflict — even a small smile — are the greatest predictor of relationship health.",
  "Beneath most arguments is a question: 'Are you there for me? Do I matter to you?'",
  "Your attachment style is not a flaw. It's your nervous system's learned strategy for staying safe in love.",
  "The 5:1 ratio: for every difficult interaction, five positive ones build a relationship that weathers storms.",
  "Stonewalling is rarely indifference — it's often a flooded nervous system asking for time to regulate.",
  "Your love language reveals what you've been hungry for, perhaps for a very long time.",
];

export const FLOODING_WORDS = ['always', 'never', 'hate ', "can't stand", 'every single time'];
export const CRISIS_WORDS = ['suicide', 'kill myself', 'end my life', "don't want to live", 'hurt myself'];

export const SESSION_STEPS: ModeKey[] = ['vent', 'understand', 'prepare', 'bridge'];

export const REPAIR_ATTEMPTS = [
  { icon: '💛', name: 'Olive branch', msg: 'I know we are in a difficult moment. I do not want to be disconnected from you. Can we try again?' },
  { icon: '🤝', name: 'Accountability', msg: 'I said some things that were not fair. I am sorry for that part of it. You did not deserve that.' },
  { icon: '⏸️', name: 'Pause request', msg: 'I am feeling overwhelmed and I need 20 minutes. I am not going anywhere — I just need to come back to this calmer.' },
  { icon: '🌿', name: 'Soft start', msg: 'Can we try talking about this again? I want to understand your side better. I am listening.' },
  { icon: '💬', name: 'I hear you', msg: 'I can see this really hurt you. Your feelings make sense to me, even if I did not intend to cause them.' },
  { icon: '🫂', name: 'Be together', msg: 'I do not want us to go to sleep like this. Can I just sit with you, even if we do not talk yet?' },
];

export const TOOLS_CONTENT = {
  breathing: [
    {
      id: 'box',
      name: 'Box Breathing',
      emoji: '⬜',
      desc: 'Equal counts of inhale, hold, exhale, hold. Used by Navy SEALs to calm under pressure.',
      steps: ['Breathe in for 4 seconds', 'Hold for 4 seconds', 'Breathe out for 4 seconds', 'Hold for 4 seconds'],
      durations: [4, 4, 4, 4],
    },
    {
      id: '478',
      name: '4-7-8 Breathing',
      emoji: '🌙',
      desc: 'Activates your parasympathetic nervous system. Particularly effective before a difficult conversation.',
      steps: ['Breathe in for 4 seconds', 'Hold for 7 seconds', 'Breathe out for 8 seconds'],
      durations: [4, 7, 8],
    },
  ],
  grounding: [
    {
      id: '54321',
      name: '5-4-3-2-1 Sensory Grounding',
      emoji: '🖐️',
      desc: 'Brings you back to the present moment using your senses.',
      steps: [
        '5 things you can see',
        '4 things you can touch',
        '3 things you can hear',
        '2 things you can smell',
        '1 thing you can taste',
      ],
    },
    {
      id: 'bodyscan',
      name: 'Quick Body Scan',
      emoji: '🧘',
      desc: 'Notice where tension lives in your body without trying to change it.',
      steps: [
        'Close your eyes and take three slow breaths',
        'Notice your jaw — is it clenched? Let it soften.',
        'Notice your shoulders — are they lifted? Let them drop.',
        'Notice your stomach — is it tight? Let it release.',
        'Notice your hands — are they fists? Open them gently.',
      ],
    },
  ],
  phrases: {
    softStartups: [
      { bad: 'You never listen to me.', good: 'I feel unheard when I share something important and it seems like it does not land.' },
      { bad: 'You always put work first.', good: 'I have been missing quality time with you. Could we plan an evening together?' },
      { bad: 'You do not care about my feelings.', good: 'When my feelings are not acknowledged, I feel invisible. I need to know they matter to you.' },
      { bad: 'Why are you so selfish?', good: 'I am feeling like my needs are not being considered right now. Can we talk about what we both need?' },
    ],
    wordsToAvoid: [
      { word: 'Always / Never', why: 'Absolutes trigger defensiveness. Replace with "Sometimes I notice..." or "Lately it feels like..."' },
      { word: 'You make me feel...', why: 'Implies blame. Replace with "I feel... when..." to own your experience.' },
      { word: 'Whatever / Fine', why: 'Signals withdrawal and contempt. Say what you actually feel instead.' },
      { word: 'You should...', why: 'Sounds parental. Replace with "What if we tried..." or "I would love it if..."' },
    ],
  },
};
