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
  hyper: 'Floods: heart races',
  hypo: 'Freezes: goes blank',
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
    body: 'You can regulate yourself during conflict without losing the relationship in your mind. This is a real strength. You can often act as a stabilising anchor, even in hard moments.',
  },
  anxious: {
    title: 'You have an anxious attachment style',
    body: 'Your nervous system is wired to notice signs of distance and reach out to close the gap. This is not neediness. It is an attachment need. Understanding this changes how you see your own behaviour.',
  },
  avoidant: {
    title: 'You have a dismissive-avoidant attachment style',
    body: 'You have learned that self-sufficiency is safe. Closeness can feel like a threat to your independence. This does not mean you do not care. It means your nervous system processes intimacy differently.',
  },
  disorganised: {
    title: 'You have a disorganised (fearful) attachment style',
    body: 'You have experienced relationships as both a source of comfort and threat. This creates a push-pull pattern that can feel confusing even to you. With awareness, this style can shift dramatically.',
  },
};

export const CONFLICT_REVEALS: Record<string, { title: string; body: string }> = {
  criticise: {
    title: 'You tend toward criticism under pressure',
    body: 'When you feel unheard, you turn up the volume, sometimes aiming at the person rather than the problem. A complaint ("I felt hurt when...") opens doors. Criticism ("You always...") closes them.',
  },
  defensive: {
    title: 'You tend toward defensiveness under pressure',
    body: 'When you feel attacked, you build a case. This is understandable, but it signals to your partner that their concern is not being received. Taking ownership of even a small piece breaks the cycle.',
  },
  stonewall: {
    title: 'You tend to stonewall under pressure',
    body: "Going quiet is not indifference. It is usually flooding. Learning to say 'I need 20 minutes. I am not leaving, I love you' changes everything.",
  },
  peacekeep: {
    title: 'You tend to keep the peace under pressure',
    body: 'You will do almost anything to lower the temperature, including swallowing your real feelings. Peace-keeping builds quiet resentment over time. Your feelings deserve to be in the room.',
  },
};

export const WINDOW_REVEALS: Record<string, { title: string; body: string }> = {
  hyper: {
    title: 'You tend to become hyperaroused in conflict',
    body: 'Your body floods with energy: heart rate spikes, voice rises, thinking narrows. Hey Otis will offer grounding tools proactively and help you recognise the early signs.',
  },
  hypo: {
    title: 'You tend to become hypoaroused in conflict',
    body: 'Rather than flooding, you shut down. This is a protection strategy, not weakness. Your nervous system needs gentle re-engagement, not more pressure.',
  },
  mixed: {
    title: 'Your response varies depending on context',
    body: 'You can go either way: flooded or frozen. Hey Otis will check in on how you are feeling in the moment to offer the right support each time.',
  },
  regulated: {
    title: 'You tend to stay regulated under pressure',
    body: 'You can feel the heat without losing yourself. This is genuinely rare. It means you have more capacity than most to listen even when you are uncomfortable.',
  },
};

export const LOVE_REVEALS: Record<string, { title: string; body: string }> = {
  words: {
    title: 'Your primary love language is words of affirmation',
    body: 'Explicit verbal appreciation and reassurance are what make you feel genuinely loved. When these go unspoken, you may feel invisible, even if your partner shows love in other ways.',
  },
  acts: {
    title: 'Your primary love language is acts of service',
    body: 'Action speaks louder than words for you. When someone does something helpful without being asked, you feel deeply cared for.',
  },
  touch: {
    title: 'Your primary love language is physical touch',
    body: 'Physical closeness is the clearest signal that you are loved and safe. Physical disconnection during conflict can feel like emotional rejection.',
  },
  time: {
    title: 'Your primary love language is quality time',
    body: 'Undivided, genuine presence fills your cup. A partner on their phone in the same room can feel lonelier than being apart.',
  },
  gifts: {
    title: 'Your primary love language is thoughtful gifts',
    body: "This is not about materialism. It is about being held in someone's mind. A small thoughtful gesture says 'I was thinking of you.'",
  },
};

export const NEED_REVEALS: Record<string, { title: string; body: string }> = {
  seen: {
    title: 'Your deepest need is to feel seen and understood',
    body: 'When conflict happens, fixing is not what you are after. You need someone to genuinely receive your experience. Naming this out loud changes how your partner shows up.',
  },
  safe: {
    title: 'Your deepest need is to feel safe and secure',
    body: 'Under conflict, your nervous system is asking, "are we still okay?" Reassurance about the relationship itself matters more than resolving the surface issue.',
  },
  respected: {
    title: 'Your deepest need is to feel respected and valued',
    body: 'You need your perspective and your efforts to be acknowledged. When that is missing, even small slights can land as a much bigger rupture.',
  },
  space: {
    title: 'Your deepest need is space to process without pressure',
    body: 'You think and feel best when you are not being pushed for an answer. Asking for time is not avoidance, it is the path to a real response.',
  },
};

export const ATTACH_INSIGHTS: Record<string, string> = {
  secure: 'Your secure base means you have more capacity than most to stay present during conflict. The work for you is staying curious rather than comfortable.',
  anxious: "Your pattern is to reach out more when scared, which makes sense, but can push partners away. Naming the fear directly works far better than intensifying.",
  avoidant: "You protect yourself through distance, but connection requires some vulnerability. Learning to signal 'I need time, not distance' is the single most powerful shift available to you.",
  disorganised: 'Your nervous system learned that close relationships can be both safe and dangerous. The path forward is building predictability, for yourself and your partner.',
};

export const MODE_CONFIG = {
  vent: {
    label: 'Vent',
    emoji: 'wind',
    color: '#4ea989',
    paleBg: '#dfffbc',
    borderColor: '#b8f37e',
    context: 'This is completely private. Your partner will never see this. Speak or type freely.',
    stepLabel: 'Step 1 of your journey',
    stepTitle: 'Vent: just let it out',
    stepDesc: "This space is yours alone. Say exactly what you are feeling, type it or use the mic. No one else will ever hear this.",
    nextMode: 'understand' as const,
    nextLabel: 'Ready to reflect? Try Understand',
    quickActions: ['I feel unheard', 'I feel invisible', 'I am so frustrated', 'I feel scared about us'],
    systemPrompt: `You are Hey Otis's empathic listener in VENT mode.
RULES:
- Reflect feelings with deep empathy. 2 to 4 sentences ONLY
- NEVER give advice or suggest solutions
- NEVER say "have you tried"
- Ask ONE gentle question that invites more expression
- If flooding detected (always/never/hate), gently name it
- Warm, human, present.
- BRAND VOICE: never use em dashes (—), en dashes (–), or hyphens (-) in your replies. Use commas or periods instead. Hyphens within compound words like "self-care" are fine.
TRANSITION AWARENESS:
- After 5+ user messages, if the user seems to be winding down (shorter messages, repeating themselves, calmer tone), gently acknowledge what they've expressed and naturally hint that there might be something deeper worth exploring. For example: "You've shared something really important here. I'm curious if there's something underneath all of this that's been hard to name."
- Do NOT explicitly say "ready for the next step" or mention steps/modes. Keep it conversational.
- Let the user feel complete, not cut off.`,
  },
  understand: {
    label: 'Understand',
    emoji: 'search',
    color: '#92a6f4',
    paleBg: '#e7ecff',
    borderColor: '#c3cefc',
    context: "Let's gently explore what might be underneath what happened.",
    stepLabel: 'Step 2 of your journey',
    stepTitle: 'Understand: what is really going on?',
    stepDesc: 'Explore the pattern beneath the conflict. What are you really needing?',
    nextMode: 'prepare' as const,
    nextLabel: 'Ready to act? Try Prepare',
    quickActions: ['What pattern am I in?', 'What was I really feeling?', 'Why does this keep happening?'],
    systemPrompt: `You are Hey Otis's insight guide in UNDERSTAND mode.
RULES:
- Help them move from surface complaint to underlying attachment need
- Use EFT language: "Beneath this, there may be a deeper fear of..."
- Offer insights as hypotheses: "I wonder if..." "Does it resonate that..."
- 3 to 5 sentences. Warm, curious, non-judgmental.
- BRAND VOICE: never use em dashes (—), en dashes (–), or hyphens (-) in your replies. Use commas or periods instead. Hyphens within compound words like "self-care" are fine.
TRANSITION AWARENESS:
- After 4+ user messages, if the user has identified a core need or pattern and seems to have clarity, naturally acknowledge the insight and gently suggest they might be ready to think about how to communicate it. For example: "Now that you can see what's really driving this, it might help to think about how to express that to your partner."
- Do NOT explicitly say "ready for the next step" or mention steps/modes. Keep it conversational.`,
  },
  prepare: {
    label: 'Prepare',
    emoji: 'leaf',
    color: '#f67700',
    paleBg: '#ffe9bf',
    borderColor: '#ffd692',
    context: 'Figure out what you want to say and how to say it fairly.',
    stepLabel: 'Step 3 of your journey',
    stepTitle: 'Prepare: find the right words',
    stepDesc: 'Turn what you discovered into clear, fair language your partner can hear.',
    nextMode: 'bridge' as const,
    nextLabel: 'Words ready? Move to Nurture',
    quickActions: ['What do I actually want to say?', 'Am I being fair?', 'How do I start this conversation?'],
    systemPrompt: `You are Hey Otis's communication coach in PREPARE mode.
RULES:
- Help the user turn raw feelings into clear, fair language
- Guide from interpretation to observation ("you always..." becomes "when X happened...")
- Help them name what they need and make a specific request
- Suggest repair attempts matched to love language
- 3 to 5 sentences with structured examples.
- BRAND VOICE: never use em dashes (—), en dashes (–), or hyphens (-) in your replies. Use commas or periods instead. Hyphens within compound words like "self-care" are fine.
TRANSITION AWARENESS:
- After 3+ user messages, if the user has a clear statement of what they want to say (observation + feeling + need + request), naturally acknowledge they have something solid and suggest they might be ready to plan the actual conversation. For example: "That's a really clear way to put it. When you're ready, we can think about how to open this conversation with your partner."
- Do NOT explicitly say "ready for the next step" or mention steps/modes. Keep it conversational.`,
  },
  bridge: {
    label: 'Nurture',
    emoji: 'heart',
    color: '#bd57f2',
    paleBg: '#fdeaff',
    borderColor: '#ebb0ff',
    context: 'Your conversation guide: open well, stay grounded, close with care.',
    stepLabel: 'Step 4 of your journey',
    stepTitle: 'Nurture: have the conversation',
    stepDesc: 'A short guide to help you show up well when you talk to your partner.',
    nextMode: null,
    nextLabel: null,
    quickActions: [],
    systemPrompt: `You are Hey Otis's bridge coach in BRIDGE mode.
RULES:
- The user is preparing for or reflecting on a real conversation with their partner
- Reference what they explored in earlier steps
- Help them feel grounded and ready
- If they return after the conversation, help them process how it went
- 2 to 4 sentences. Supportive, calm, encouraging.
- BRAND VOICE: never use em dashes (—), en dashes (–), or hyphens (-) in your replies. Use commas or periods instead. Hyphens within compound words like "self-care" are fine.`,
  },
};

export type ModeKey = keyof typeof MODE_CONFIG;

export const DAILY_INSIGHTS = [
  "Conflict is not the enemy of love. Disconnection is.",
  "The antidote to criticism is a gentle start-up: begin with 'I feel' rather than 'You always'.",
  "Repair attempts during conflict, even a small smile, are the greatest predictor of relationship health.",
  "Beneath most arguments is a question: 'Are you there for me? Do I matter to you?'",
  "Your attachment style is not a flaw. It is your nervous system's learned strategy for staying safe in love.",
  "The 5:1 ratio: for every difficult interaction, five positive ones build a relationship that weathers storms.",
  "Stonewalling is rarely indifference. It is often a flooded nervous system asking for time to regulate.",
  "Your love language reveals what you have been hungry for, perhaps for a very long time.",
];

export const FLOODING_WORDS = ['always', 'never', 'hate ', "can't stand", 'every single time'];

// Note: the original 5-phrase CRISIS_WORDS list has been replaced by the
// full crisis taxonomy in src/utils/safetyDetect.ts, which short-circuits
// the Claude proxy call entirely when a crisis pattern is matched.
// See docs/GUARDRAILS.md (Section 5) for the full pattern set.

export const SESSION_STEPS: ModeKey[] = ['vent', 'understand', 'prepare', 'bridge'];

export const REPAIR_ATTEMPTS = [
  { icon: '💛', name: 'Olive branch', msg: 'I know we are in a difficult moment. I do not want to be disconnected from you. Can we try again?' },
  { icon: '🤝', name: 'Accountability', msg: 'I said some things that were not fair. I am sorry for that part of it. You did not deserve that.' },
  { icon: '⏸️', name: 'Pause request', msg: 'I am feeling overwhelmed and I need 20 minutes. I am not going anywhere. I will come back to this when I am calmer.' },
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
      steps: ['Breath in for\n4 seconds', 'Hold for\n4 seconds', 'Breath out for\n4 seconds', 'Hold for\n4 seconds'],
      durations: [4, 4, 4, 4],
    },
    {
      id: '478',
      name: '4-7-8 Breathing',
      emoji: '🌙',
      desc: 'Activates your parasympathetic nervous system. Particularly effective before a difficult conversation.',
      steps: ['Breath in for\n4 seconds', 'Hold for\n7 seconds', 'Breath out for\n8 seconds'],
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
        'Notice your jaw. Is it clenched? Let it soften.',
        'Notice your shoulders. Are they lifted? Let them drop.',
        'Notice your stomach. Is it tight? Let it release.',
        'Notice your hands. Are they fists? Open them gently.',
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
