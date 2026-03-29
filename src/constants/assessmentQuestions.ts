// Assessment questions and scoring for Tether relationship wellness app

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const QUIZ_META: Record<
  string,
  {
    title: string;
    subtitle: string;
    questionCount: number;
    estimatedMins: number;
    accentColor: string;
  }
> = {
  attachment: {
    title: 'Attachment Style',
    subtitle: 'Understand how you connect and bond in close relationships',
    questionCount: 12,
    estimatedMins: 5,
    accentColor: '#C17F5A', // terracotta
  },
  love: {
    title: 'Love Language',
    subtitle: 'Discover how you most naturally give and receive love',
    questionCount: 10,
    estimatedMins: 4,
    accentColor: '#C4A248', // gold
  },
  conflict: {
    title: 'Conflict Style',
    subtitle: 'See how you tend to respond when things get tense',
    questionCount: 8,
    estimatedMins: 4,
    accentColor: '#D4917A', // blush
  },
  window: {
    title: 'Window of Tolerance',
    subtitle: 'Explore how your body responds to stress in relationships',
    questionCount: 6,
    estimatedMins: 3,
    accentColor: '#7E9E8C', // sage
  },
  need: {
    title: 'Core Relationship Need',
    subtitle: 'Identify what matters most to you when things feel hard',
    questionCount: 8,
    estimatedMins: 4,
    accentColor: '#C17F5A', // terracotta
  },
};

// ---------------------------------------------------------------------------
// Question types
// ---------------------------------------------------------------------------

export type LikertQuestion = {
  kind: 'likert';
  id: string;
  text: string;
  dimensions: Record<string, number>; // dimension key -> score weight
};

export type ChoiceQuestion = {
  kind: 'choice';
  id: string;
  text: string;
  options: { text: string; dimension: string }[];
};

export type Question = LikertQuestion | ChoiceQuestion;

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

const attachmentQuestions: LikertQuestion[] = [
  // Anxious-loading items (5)
  {
    kind: 'likert',
    id: 'att_1',
    text: 'I worry that my partner will stop loving me if I show my needier side.',
    dimensions: { anxious: 1.0, secure: -0.5 },
  },
  {
    kind: 'likert',
    id: 'att_2',
    text: 'When my partner is quiet or distant, I immediately wonder if something is wrong between us.',
    dimensions: { anxious: 1.0, avoidant: -0.4 },
  },
  {
    kind: 'likert',
    id: 'att_3',
    text: 'I find myself replaying conversations to figure out if I said something that upset them.',
    dimensions: { anxious: 0.9, secure: -0.4 },
  },
  {
    kind: 'likert',
    id: 'att_4',
    text: 'I feel uneasy unless I know my partner is happy with me.',
    dimensions: { anxious: 1.0, avoidant: -0.3 },
  },
  {
    kind: 'likert',
    id: 'att_5',
    text: 'My feelings about the relationship can shift a lot depending on how my partner has been acting lately.',
    dimensions: { anxious: 0.8, secure: -0.5 },
  },
  // Avoidant-loading items (4)
  {
    kind: 'likert',
    id: 'att_6',
    text: 'I prefer to sort through problems on my own rather than lean on my partner.',
    dimensions: { avoidant: 1.0, secure: -0.5 },
  },
  {
    kind: 'likert',
    id: 'att_7',
    text: 'Sharing deep feelings with my partner makes me uncomfortable.',
    dimensions: { avoidant: 1.0, anxious: -0.3 },
  },
  {
    kind: 'likert',
    id: 'att_8',
    text: 'I pull back when the relationship starts feeling too intense or close.',
    dimensions: { avoidant: 0.9, secure: -0.5 },
  },
  {
    kind: 'likert',
    id: 'att_9',
    text: 'Depending on someone else for emotional support feels risky to me.',
    dimensions: { avoidant: 1.0, anxious: -0.2 },
  },
  // Secure-loading items (3, reverse of anxious/avoidant)
  {
    kind: 'likert',
    id: 'att_10',
    text: 'I feel comfortable turning to my partner when I am stressed or upset.',
    dimensions: { secure: 1.0, avoidant: -0.8 },
  },
  {
    kind: 'likert',
    id: 'att_11',
    text: 'I trust that my partner will be there for me even when we disagree.',
    dimensions: { secure: 1.0, anxious: -0.8 },
  },
  {
    kind: 'likert',
    id: 'att_12',
    text: 'I feel settled and at ease in this relationship most of the time.',
    dimensions: { secure: 1.0, anxious: -0.6, avoidant: -0.6 },
  },
];

const loveQuestions: ChoiceQuestion[] = [
  {
    kind: 'choice',
    id: 'love_1',
    text: 'After a hard week, what would feel more meaningful?',
    options: [
      { text: 'My partner tells me they are proud of how I handled everything', dimension: 'words' },
      { text: 'My partner takes over dinner so I can just rest', dimension: 'acts' },
    ],
  },
  {
    kind: 'choice',
    id: 'love_2',
    text: 'When I am feeling low, what comforts me most?',
    options: [
      { text: 'My partner holds me close without saying anything', dimension: 'touch' },
      { text: 'My partner puts their phone away and just listens', dimension: 'time' },
    ],
  },
  {
    kind: 'choice',
    id: 'love_3',
    text: 'Which gesture would make me feel most loved on an ordinary Tuesday?',
    options: [
      { text: 'A small surprise — my favourite snack left on my desk', dimension: 'gifts' },
      { text: 'A genuine "I love the way you think" out of nowhere', dimension: 'words' },
    ],
  },
  {
    kind: 'choice',
    id: 'love_4',
    text: 'If my partner wanted to show appreciation, which would land deeper?',
    options: [
      { text: 'They handle all the errands for the weekend without being asked', dimension: 'acts' },
      { text: 'They plan a slow afternoon walk — just the two of us, no agenda', dimension: 'time' },
    ],
  },
  {
    kind: 'choice',
    id: 'love_5',
    text: 'After an argument that we have resolved, what would help me feel reconnected?',
    options: [
      { text: 'A long hug that says we are okay again', dimension: 'touch' },
      { text: 'A heartfelt note saying what they appreciate about me', dimension: 'words' },
    ],
  },
  {
    kind: 'choice',
    id: 'love_6',
    text: 'Which birthday gesture would mean the most?',
    options: [
      { text: 'A thoughtful gift they picked because it reminded them of me', dimension: 'gifts' },
      { text: 'They book the whole day so it is just about us', dimension: 'time' },
    ],
  },
  {
    kind: 'choice',
    id: 'love_7',
    text: 'When I have achieved something I am proud of, what feels best?',
    options: [
      { text: 'My partner squeezes my hand and says "I knew you could do it"', dimension: 'touch' },
      { text: 'My partner takes care of something off my plate to celebrate', dimension: 'acts' },
    ],
  },
  {
    kind: 'choice',
    id: 'love_8',
    text: 'Which would feel more romantic on a weekend morning?',
    options: [
      { text: 'My partner brings me coffee and lingers to chat with no rush', dimension: 'time' },
      { text: 'My partner leaves a small note saying what they love about me', dimension: 'words' },
    ],
  },
  {
    kind: 'choice',
    id: 'love_9',
    text: 'When I am sick, what makes me feel most cared for?',
    options: [
      { text: 'My partner makes soup and handles the household without fuss', dimension: 'acts' },
      { text: 'My partner brings me something small to cheer me up', dimension: 'gifts' },
    ],
  },
  {
    kind: 'choice',
    id: 'love_10',
    text: 'Which would stay with me longest as a memory of feeling loved?',
    options: [
      { text: 'Slow dancing in the kitchen with no music', dimension: 'touch' },
      { text: 'A framed photo or keepsake from a moment that mattered to us', dimension: 'gifts' },
    ],
  },
];

const conflictQuestions: ChoiceQuestion[] = [
  {
    kind: 'choice',
    id: 'conf_1',
    text: 'Your partner forgot something important you asked them to do — again. What is your gut response?',
    options: [
      { text: 'Tell them this keeps happening and you are tired of always reminding them', dimension: 'criticise' },
      { text: 'Explain that you mentioned it clearly and the drop was on their side', dimension: 'defensive' },
      { text: 'Go quiet and handle it yourself without saying anything', dimension: 'stonewall' },
      { text: 'Let it go for now — you do not want to turn it into a fight', dimension: 'peacekeep' },
    ],
  },
  {
    kind: 'choice',
    id: 'conf_2',
    text: 'Your partner raises their voice during a disagreement. How do you react?',
    options: [
      { text: 'Match their energy and say they are being unreasonable', dimension: 'criticise' },
      { text: 'Stay composed and lay out your reasoning point by point', dimension: 'defensive' },
      { text: 'Stop responding and wait for it to blow over', dimension: 'stonewall' },
      { text: 'Back down and apologise even if you were not wrong', dimension: 'peacekeep' },
    ],
  },
  {
    kind: 'choice',
    id: 'conf_3',
    text: 'You feel like you are always the one initiating plans. You bring it up. They shrug it off. You:',
    options: [
      { text: 'Say that their lack of effort shows you how much they care', dimension: 'criticise' },
      { text: 'Point out all the things you do and ask why that is never noticed', dimension: 'defensive' },
      { text: 'Drop the subject and feel quietly resentful', dimension: 'stonewall' },
      { text: 'Agree it is probably fine and change the subject', dimension: 'peacekeep' },
    ],
  },
  {
    kind: 'choice',
    id: 'conf_4',
    text: 'Your partner brings up a pattern they find frustrating about you. Your first instinct is to:',
    options: [
      { text: 'Point out a pattern of theirs that bothers you just as much', dimension: 'criticise' },
      { text: 'Explain the context that made you act that way', dimension: 'defensive' },
      { text: 'Nod along but feel yourself shutting down inside', dimension: 'stonewall' },
      { text: 'Apologise quickly so the tension goes away', dimension: 'peacekeep' },
    ],
  },
  {
    kind: 'choice',
    id: 'conf_5',
    text: 'An argument has been going in circles for twenty minutes. You:',
    options: [
      { text: 'Get sharper and more pointed — you want them to hear you', dimension: 'criticise' },
      { text: 'Restate your original position in more detail', dimension: 'defensive' },
      { text: 'Go silent and leave the room', dimension: 'stonewall' },
      { text: 'Offer a compromise you do not fully believe in, just to end it', dimension: 'peacekeep' },
    ],
  },
  {
    kind: 'choice',
    id: 'conf_6',
    text: 'Your partner says you are too sensitive. How do you respond?',
    options: [
      { text: 'Tell them they are emotionally unavailable', dimension: 'criticise' },
      { text: 'Explain exactly why your reaction was reasonable', dimension: 'defensive' },
      { text: 'Say nothing and withdraw for the rest of the evening', dimension: 'stonewall' },
      { text: 'Wonder if they are right and try to tone yourself down', dimension: 'peacekeep' },
    ],
  },
  {
    kind: 'choice',
    id: 'conf_7',
    text: 'You and your partner have very different views on a big decision. After talking, nothing is resolved. You:',
    options: [
      { text: 'Keep pushing until they admit your point has merit', dimension: 'criticise' },
      { text: 'Lay out all the reasons your position makes more sense', dimension: 'defensive' },
      { text: 'Stop engaging and let things sit indefinitely', dimension: 'stonewall' },
      { text: 'Give in on something you care about to move forward', dimension: 'peacekeep' },
    ],
  },
  {
    kind: 'choice',
    id: 'conf_8',
    text: 'Your partner seems frustrated but will not say why. You:',
    options: [
      { text: 'Get frustrated too and call out the passive behaviour', dimension: 'criticise' },
      { text: 'Tell them you have done nothing wrong so the ball is in their court', dimension: 'defensive' },
      { text: 'Leave them alone and busy yourself with something else', dimension: 'stonewall' },
      { text: 'Keep checking in gently even though it is draining you', dimension: 'peacekeep' },
    ],
  },
];

const windowQuestions: LikertQuestion[] = [
  {
    kind: 'likert',
    id: 'win_1',
    text: 'During a tense moment with my partner, I notice my heart racing or my chest tightening.',
    dimensions: { hyper: 1.0, regulated: -0.5 },
  },
  {
    kind: 'likert',
    id: 'win_2',
    text: 'When conflict starts, I go blank or feel numb — like I have left my own body.',
    dimensions: { hypo: 1.0, regulated: -0.5 },
  },
  {
    kind: 'likert',
    id: 'win_3',
    text: 'I can stay aware of my physical sensations during a hard conversation without being overwhelmed by them.',
    dimensions: { regulated: 1.0, hyper: -0.5, hypo: -0.5 },
  },
  {
    kind: 'likert',
    id: 'win_4',
    text: 'My body sometimes swings between feeling flooded and feeling completely shut down in the same argument.',
    dimensions: { mixed: 1.0, regulated: -0.6 },
  },
  {
    kind: 'likert',
    id: 'win_5',
    text: 'I feel a strong urge to escape or end the conversation when tension rises — my body just wants out.',
    dimensions: { hypo: 0.9, hyper: 0.4, regulated: -0.5 },
  },
  {
    kind: 'likert',
    id: 'win_6',
    text: 'Even during conflict I feel grounded enough to listen and respond without acting from pure reaction.',
    dimensions: { regulated: 1.0, hyper: -0.6, hypo: -0.6 },
  },
];

const needQuestions: ChoiceQuestion[] = [
  {
    kind: 'choice',
    id: 'need_1',
    text: 'Your partner seems distracted when you are sharing something personal. What bothers you most?',
    options: [
      { text: 'The feeling that what I said did not really land or matter to them', dimension: 'seen' },
      { text: 'I start wondering if they are pulling away or if something is wrong', dimension: 'safe' },
      { text: 'It feels like they are not taking what I shared seriously', dimension: 'respected' },
      { text: 'I wish I had just kept it to myself — I need to not rely on them for this', dimension: 'space' },
    ],
  },
  {
    kind: 'choice',
    id: 'need_2',
    text: 'After a hard conversation, what would help you feel okay again?',
    options: [
      { text: 'Knowing they really understood where I was coming from', dimension: 'seen' },
      { text: 'Some reassurance that we are still solid and connected', dimension: 'safe' },
      { text: 'Feeling like my perspective was taken seriously, not just tolerated', dimension: 'respected' },
      { text: 'Some time to myself to process before coming back together', dimension: 'space' },
    ],
  },
  {
    kind: 'choice',
    id: 'need_3',
    text: 'Your partner disagrees with a decision you made. What stings most?',
    options: [
      { text: 'They did not ask about my reasons before jumping to criticism', dimension: 'seen' },
      { text: 'Now I am not sure if they fully support me', dimension: 'safe' },
      { text: 'They treated it like my judgment could not be trusted', dimension: 'respected' },
      { text: 'I need to be able to make decisions without it becoming a discussion', dimension: 'space' },
    ],
  },
  {
    kind: 'choice',
    id: 'need_4',
    text: 'You are going through something difficult. Your partner offers advice right away. You feel:',
    options: [
      { text: 'Like they skipped past the part where I needed to feel heard', dimension: 'seen' },
      { text: 'A little unsettled — I needed them to just be with me first', dimension: 'safe' },
      { text: 'Like they assumed I could not figure it out on my own', dimension: 'respected' },
      { text: 'Relieved they offered something — I mostly just needed to vent alone first', dimension: 'space' },
    ],
  },
  {
    kind: 'choice',
    id: 'need_5',
    text: 'Your partner brings up an old issue again. What is your core reaction?',
    options: [
      { text: 'I wonder if they have ever actually seen my side of it', dimension: 'seen' },
      { text: 'It makes me uneasy — like the ground under us is still shaky', dimension: 'safe' },
      { text: 'It feels like they do not trust that I have grown or changed', dimension: 'respected' },
      { text: 'I need to step back — rehashing the past is too much for me right now', dimension: 'space' },
    ],
  },
  {
    kind: 'choice',
    id: 'need_6',
    text: 'You do not hear from your partner for longer than expected during a busy day. What goes through your mind?',
    options: [
      { text: 'I hope nothing I said earlier gave them the wrong impression', dimension: 'seen' },
      { text: 'I start to feel a low hum of anxiety about where we stand', dimension: 'safe' },
      { text: 'I trust they are busy — I do not need to be checked in on', dimension: 'respected' },
      { text: 'Honestly, a little space like this feels fine to me', dimension: 'space' },
    ],
  },
  {
    kind: 'choice',
    id: 'need_7',
    text: 'Your partner makes a big plan without consulting you. What is the core issue for you?',
    options: [
      { text: 'They did not think to consider how it fits with what I have going on', dimension: 'seen' },
      { text: 'It makes me wonder if we are really on the same team', dimension: 'safe' },
      { text: 'They should have treated this as something we decide together', dimension: 'respected' },
      { text: 'I would actually prefer they handle things without needing my input each time', dimension: 'space' },
    ],
  },
  {
    kind: 'choice',
    id: 'need_8',
    text: 'You open up about something vulnerable. Your partner responds but it feels off. What would you wish for?',
    options: [
      { text: 'That they had reflected back what I actually said, so I knew they got it', dimension: 'seen' },
      { text: 'A simple signal that they are still here and we are safe', dimension: 'safe' },
      { text: 'That they treated it as something real, not something to fix or dismiss', dimension: 'respected' },
      { text: 'Honestly, sometimes I wish I had just sat with it privately first', dimension: 'space' },
    ],
  },
];

export const ASSESSMENT_QUESTIONS: Record<string, Question[]> = {
  attachment: attachmentQuestions,
  love: loveQuestions,
  conflict: conflictQuestions,
  window: windowQuestions,
  need: needQuestions,
};

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

export function scoreAssessment(
  type: string,
  responses: Record<string, number | string>
): {
  primary: string;
  secondary?: string;
  scores: Record<string, number>;
  confidence: 'high' | 'medium' | 'low';
} {
  const questions = ASSESSMENT_QUESTIONS[type];
  if (!questions) {
    throw new Error(`Unknown assessment type: ${type}`);
  }

  const raw: Record<string, number> = {};

  for (const question of questions) {
    const response = responses[question.id];
    if (response === undefined) continue;

    if (question.kind === 'likert') {
      const likertValue = typeof response === 'number' ? response : parseFloat(response as string);
      if (isNaN(likertValue)) continue;
      for (const [dimension, weight] of Object.entries(question.dimensions)) {
        raw[dimension] = (raw[dimension] ?? 0) + likertValue * weight;
      }
    } else if (question.kind === 'choice') {
      const dimension = typeof response === 'string' ? response : String(response);
      raw[dimension] = (raw[dimension] ?? 0) + 1;
    }
  }

  // Collect all known dimensions for this type so zero-scored ones are present
  const allDimensions = new Set<string>();
  for (const question of questions) {
    if (question.kind === 'likert') {
      Object.keys(question.dimensions).forEach((d) => allDimensions.add(d));
    } else {
      question.options.forEach((o) => allDimensions.add(o.dimension));
    }
  }
  for (const dim of allDimensions) {
    if (raw[dim] === undefined) raw[dim] = 0;
  }

  // Normalise to 0–100
  const values = Object.values(raw);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal;

  const scores: Record<string, number> = {};
  if (range === 0) {
    // All equal: spread them at 50
    for (const dim of Object.keys(raw)) {
      scores[dim] = 50;
    }
  } else {
    for (const [dim, val] of Object.entries(raw)) {
      scores[dim] = Math.round(((val - minVal) / range) * 100);
    }
  }

  // Sort dimensions by score descending
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);

  let primary = sorted[0]?.[0] ?? '';
  const secondary = sorted[1]?.[0];

  // Attachment special rule: disorganised if both anxious >= 60 and avoidant >= 60
  if (type === 'attachment') {
    const anxiousScore = scores['anxious'] ?? 0;
    const avoidantScore = scores['avoidant'] ?? 0;
    if (anxiousScore >= 60 && avoidantScore >= 60) {
      primary = 'disorganised';
    }
  }

  // Confidence based on spread between top two
  const topScore = sorted[0]?.[1] ?? 0;
  const secondScore = sorted[1]?.[1] ?? 0;
  const spread = topScore - secondScore;

  let confidence: 'high' | 'medium' | 'low';
  if (spread >= 20) {
    confidence = 'high';
  } else if (spread >= 10) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  const result: {
    primary: string;
    secondary?: string;
    scores: Record<string, number>;
    confidence: 'high' | 'medium' | 'low';
  } = {
    primary,
    scores,
    confidence,
  };

  // Love always includes secondary
  if (type === 'love' && secondary !== undefined) {
    result.secondary = secondary;
  }

  return result;
}
