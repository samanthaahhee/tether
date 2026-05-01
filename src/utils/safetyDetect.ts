/**
 * safetyDetect.ts
 * ────────────────────────────────────────────────────────────────────
 * Pre-LLM safety detection for Hey Otis user inputs.
 *
 * Runs on every user message BEFORE it reaches the Claude proxy. If a
 * crisis pattern matches, the LLM call is short-circuited and a
 * categorical safety response is returned instead.
 *
 * Patterns are intentionally broad. False positives are safer than
 * misses — a user who is told "this needs more support than I can
 * give" when they meant something benign loses one message; a user
 * in crisis whose signal is missed loses much more.
 *
 * Categories map 1:1 to the 6 crisis categories defined in
 * docs/GUARDRAILS.md (Section 5).
 *
 * Patterns include common variants and obfuscations:
 *   - "kill myself" / "kms" / "kill mysef"
 *   - "unalive" / "unaliving" (TikTok-era substitution for "kill")
 *   - hypothetical framings ("what would someone do if…")
 *   - past-tense framings ("I used to want to…")
 *   - third-person framings ("a friend is…")
 *   - joking framings ("kidding obviously")
 *
 * The hypothetical/fictional/joking framings DO NOT bypass the crisis
 * response. They trigger it just like first-person disclosure.
 * (Pillar 8 of the Guardrails Framework.)
 * ────────────────────────────────────────────────────────────────────
 */

export type CrisisCategory =
  | 'suicide'
  | 'self_harm'
  | 'abuse'
  | 'child_safety'
  | 'psychosis'
  | 'substance_crisis'
  | 'eating_disorder';

export type InputQuality =
  | 'ok'
  | 'too_short'
  | 'gibberish'
  | 'repeat_char';

export interface SafetyResult {
  /** If non-null, the LLM call should be short-circuited. */
  crisis: CrisisCategory | null;
  /** If non-'ok', the user should be asked for more before LLM is called. */
  quality: InputQuality;
}

// ── Crisis pattern lists ────────────────────────────────────────────
//
// Each entry is a JS regex that matches the underlying signal.
// We intentionally use word-boundary anchors and case-insensitive
// matching to keep noise low.

const SUICIDE_PATTERNS: RegExp[] = [
  // Direct
  /\bkill\s+(my\s*self|mysef|me\s*self)\b/i,
  /\bkms\b/i,
  /\bkys\b/i,
  /\bend\s+(it\s+all|my\s+life|myself|things)\b/i,
  /\bsuicid(e|al)\b/i,
  /\btake\s+my\s+(own\s+)?life\b/i,
  /\bwant\s+to\s+(die|be\s+dead|not\s+exist|not\s+be\s+here)\b/i,
  /\b(no|don'?t\s+see\s+(a\s+)?)point\s+(in\s+)?(living|going\s+on|being\s+alive)\b/i,
  /\bbetter\s+off\s+(dead|without\s+me|if\s+i\s+(was|were)\s+gone)\b/i,
  /\beveryone\s+(would\s+be\s+)?better\s+off\s+without\s+me\b/i,
  // Coded / Gen-Z
  /\bunaliv(e|ing|ed)\b/i,
  /\bbecome\s+a\s+ghost\b/i,
  // Method-suggestive
  /\bhow\s+(many|much)\s+(pills?|paracetamol|ibuprofen)\s+would\b/i,
  /\bwhat'?s\s+the\s+(easiest|fastest|painless)\s+way\s+to\s+(die|end)/i,
  // Indirect
  /\bif\s+i\s+(weren'?t|wasn'?t)\s+(here|alive|around)\b/i,
  /\bwon'?t\s+see\s+(another|the\s+next)\s+(year|birthday|christmas)\b/i,
  /\bafter\s+i'?m\s+gone\b/i,
];

const SELF_HARM_PATTERNS: RegExp[] = [
  /\bcut(ting)?\s+(my\s*self|me)\b/i,
  /\bhurt(ing)?\s+(my\s*self|me)\s+(on\s+purpose)?\b/i,
  /\bself[-\s]?harm(ing)?\b/i,
  /\bburn(ing)?\s+my\s*self\b/i,
  /\bhitting\s+my\s*self\b/i,
];

const ABUSE_PATTERNS: RegExp[] = [
  // Physical
  /\b(my\s+)?(husband|wife|partner|boyfriend|girlfriend|he|she|they)\s+(hits|hit|punches|punched|hurts|hurt|strangl|chok(es?|ed)|beats?|beat|slaps?|slapped)\s+me\b/i,
  /\bi'?m\s+(scared|afraid|terrified)\s+(of|that)\s+(my\s+)?(husband|wife|partner|him|her|them)\b/i,
  /\bafraid\s+(my\s+)?(husband|wife|partner|he|she|they)\s+(will|might|could)\s+(hurt|kill|harm)\s+me\b/i,
  // Coercive control
  /\b(won'?t|doesn'?t|will\s+not)\s+let\s+me\s+(see|talk\s+to|leave|work|have)\b/i,
  /\bcontrols?\s+(all\s+)?(my|the)\s+money\b/i,
  /\btracks?\s+(my\s+)?(phone|location|movements)\b/i,
  /\blocks?\s+me\s+(in|out)\b/i,
  // Sexual coercion
  /\bforces?\s+me\s+to\s+have\s+sex\b/i,
  /\b(rapes?|raped)\s+me\b/i,
  /\b(non[-\s]?consensual|without\s+my\s+consent)\b/i,
  // Escalation
  /\bit'?s\s+getting\s+(worse|more\s+violent)\b/i,
  /\b(domestic|partner|intimate\s+partner)\s+(violence|abuse)\b/i,
  // Threats to user
  /\b(threatened\s+to\s+kill|said\s+he'?ll\s+kill|will\s+kill\s+me)\b/i,
  // Third-person disclosures — friend / family member / "someone" being abused.
  // We surface these even when the user isn't the one being harmed because:
  //   (a) the user may be discreetly disclosing about themselves
  //   (b) Pillar 3 still requires we hand them resources for the friend
  /\b(friend|sister|brother|mother|father|cousin|colleague|coworker|neighbour|neighbor|someone\s+i\s+know)\s+(is|was)\s+(being\s+)?(abused|beaten|hit|hurt|raped|controlled|threatened)\b/i,
  /\bsomeone\s+is\s+(abusing|beating|hurting|raping|controlling|threatening)\s+(my|a)\b/i,
];

const CHILD_SAFETY_PATTERNS: RegExp[] = [
  // User as potential threat
  /\bhurt(ing)?\s+(my|the|a)\s+(child|kid|baby|son|daughter|toddler)\b/i,
  /\bwant\s+to\s+(hurt|hit|harm)\s+(my|the)\s+(child|kid|baby|son|daughter)\b/i,
  // Disclosure of abuse
  /\b(child|kid)\s+abuse\b/i,
  /\b(my|the)\s+(child|kid|son|daughter)\s+is\s+(in\s+)?danger\b/i,
  /\bsomeone\s+is\s+(hurting|abusing|touching)\s+(my|a)\s+(child|kid)\b/i,
];

const PSYCHOSIS_PATTERNS: RegExp[] = [
  /\bvoices?\s+(in\s+my\s+head\s+)?(are\s+)?(telling|talking\s+to|talk\s+to|saying)\s+me\b/i,
  /\bhearing\s+voices\b/i,
  /\bhallucinat/i,
  /\b(being|am)\s+followed\b/i,
  /\bbeing\s+watched\s+(by|through)\b/i,
  /\bbeing\s+poison(ed|ing)\b/i,
  /\bgovernment\s+is\s+(after|tracking|monitoring)\s+me\b/i,
  /\bi'?m\s+not\s+(real|here)\b/i,
  /\bthis\s+isn'?t\s+(real|happening)\b/i,
  /\b(disassociat|dissociat)/i,
];

const SUBSTANCE_CRISIS_PATTERNS: RegExp[] = [
  /\boverdose|overdosed|overdosing\b/i,
  /\bod'?(d|ed|ing)\b/i,
  /\b(can'?t|cannot)\s+stop\s+(drinking|using|taking)\b/i,
  /\b(in|going\s+through)\s+withdrawal\b/i,
  /\bdrunk\s+(driving|behind\s+the\s+wheel)\b/i,
  /\b(took|taken)\s+too\s+many\s+(pills?|tablets?|paracetamol|ibuprofen)\b/i,
];

const EATING_DISORDER_PATTERNS: RegExp[] = [
  /\bhaven'?t\s+eaten\s+in\s+\d+\s+(day|week)/i,
  /\bstop(ped)?\s+eating\b/i,
  /\bpurg(e|ing|ed)\b/i,
  /\bthrow(ing|n)?\s+up\s+(after|on\s+purpose)\b/i,
  /\bmake\s+myself\s+(throw\s+up|sick)\b/i,
  /\b(anorexi|bulimi)/i,
];

const PATTERN_MAP: Record<CrisisCategory, RegExp[]> = {
  suicide: SUICIDE_PATTERNS,
  self_harm: SELF_HARM_PATTERNS,
  abuse: ABUSE_PATTERNS,
  child_safety: CHILD_SAFETY_PATTERNS,
  psychosis: PSYCHOSIS_PATTERNS,
  substance_crisis: SUBSTANCE_CRISIS_PATTERNS,
  eating_disorder: EATING_DISORDER_PATTERNS,
};

// Order matters — categories listed first take precedence on multi-match.
// Suicide/self-harm/child-safety have the highest urgency.
const CATEGORY_PRIORITY: CrisisCategory[] = [
  'suicide',
  'self_harm',
  'child_safety',
  'abuse',
  'psychosis',
  'substance_crisis',
  'eating_disorder',
];

/**
 * Detect a crisis category in user input, returning the highest-priority
 * matching category or null. Patterns match regardless of framing
 * (hypothetical, fictional, third-person, past-tense, joking) — see
 * Pillar 8 of the Guardrails Framework.
 */
export function detectCrisisCategory(text: string): CrisisCategory | null {
  if (!text) return null;
  for (const category of CATEGORY_PRIORITY) {
    const patterns = PATTERN_MAP[category];
    if (patterns.some((p) => p.test(text))) return category;
  }
  return null;
}

/**
 * Heuristic input quality check. Catches:
 *   - gibberish (no vowels OR very low character variety, e.g. "akakak")
 *   - same character repeated 5+ times in a row (asdfff)
 *   - too short (under 10 chars trimmed)
 *
 * Order matters: gibberish/repeat checks run BEFORE the length check
 * because a 6-char gibberish input ("asdfgh") is more diagnostic of
 * gibberish than of just being short. The length check is the fallback.
 *
 * The thresholds are conservative — better to ask the user to elaborate
 * once than to send "akak" to Claude and get back a confident-sounding
 * but meaningless clinical-style response.
 */
export function checkInputQuality(text: string): InputQuality {
  const trimmed = text?.trim() ?? '';
  const cleaned = trimmed.replace(/\s/g, '');

  // Gibberish & repeat checks first — fire even on shortish inputs because
  // these are clearer signals than length alone.
  if (cleaned.length >= 4) {
    if (!/[aeiouAEIOUyY]/.test(cleaned)) return 'gibberish';
    if (/(.)\1{4,}/.test(cleaned)) return 'repeat_char';
    // Low character variety — e.g. "akakak" has just {a, k}. If 8+ chars
    // use ≤ 3 distinct characters, it's almost certainly typed-by-rolling-
    // fingers gibberish, not a real word.
    if (cleaned.length >= 8) {
      const distinct = new Set(cleaned.toLowerCase()).size;
      if (distinct <= 3) return 'gibberish';
    }
  }

  if (trimmed.length < 10) return 'too_short';
  return 'ok';
}

/**
 * Combined safety check. Crisis detection takes precedence over
 * input-quality flags — a 5-character "I want to kill myself"
 * substring should still trigger a crisis response, even if the
 * surrounding text is short.
 */
export function checkSafety(text: string): SafetyResult {
  return {
    crisis: detectCrisisCategory(text),
    quality: checkInputQuality(text),
  };
}
