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
    context: "You are safe here. Express whatever you're feeling — no judgment, no fixing.",
    stepLabel: 'Step 1 of your journey',
    stepTitle: 'Vent — just let it out',
    stepDesc: "No advice, no fixing. Say exactly what you're feeling. When you're ready, move to Understand.",
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
    nextMode: null,
    nextLabel: null,
    quickActions: ['Help me write a message', 'What is a repair attempt?', 'How do I start this conversation?'],
    systemPrompt: `You are Tether's communication coach in PREPARE mode.
RULES:
- Help construct NVC messages: Observation, Feeling, Need, Request
- Guide from interpretation to observation
- Suggest repair attempts matched to love language
- 3-5 sentences with structured examples.`,
  },
  nurture: {
    label: 'Nurture',
    emoji: '💛',
    color: '#D4917A',
    paleBg: '#F5E4DC',
    borderColor: '#D4917A',
    context: "Things are okay — let's invest in your bond proactively.",
    stepLabel: 'Use when things are okay',
    stepTitle: 'Nurture — invest in your bond',
    stepDesc: 'Small daily acts of connection keep your relationship strong.',
    nextMode: null,
    nextLabel: null,
    quickActions: ['Give me a connection ritual', 'How do I show appreciation?', 'How do we build trust?'],
    systemPrompt: `You are Tether's nurture coach in NURTURE mode.
RULES:
- Offer Gottman-inspired bids for connection
- Suggest love language specific activities
- Share insights about the 5:1 ratio
- Specific weekly challenge in every response. 3-5 sentences.`,
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
