// safety.ts — server-side crisis detection (defense in depth)
//
// The mobile client (src/utils/safetyDetect.ts) is the primary line of
// defense. This server-side detector is a secondary backstop that catches:
//   - Direct API access that bypasses the client
//   - Older / regressed client versions that lose the check
//   - Compromised client installations
//
// If a crisis pattern is detected here, the request is NOT forwarded to
// Anthropic. The proxy returns a generic safety response (no country-
// specific helplines — those live client-side, where the user's country
// preference is stored).
//
// Patterns are kept INTENTIONALLY ALIGNED with src/utils/safetyDetect.ts.
// When updating one, update the other. There is a red-team test suite
// (docs/GUARDRAILS.md Section 13) that exercises both.

export type CrisisCategory =
  | "suicide"
  | "self_harm"
  | "abuse"
  | "child_safety"
  | "psychosis"
  | "substance_crisis"
  | "eating_disorder";

const SUICIDE: RegExp[] = [
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
  /\bunaliv(e|ing|ed)\b/i,
  /\bbecome\s+a\s+ghost\b/i,
  /\bhow\s+(many|much)\s+(pills?|paracetamol|ibuprofen)\s+would\b/i,
  /\bwhat'?s\s+the\s+(easiest|fastest|painless)\s+way\s+to\s+(die|end)/i,
  /\bif\s+i\s+(weren'?t|wasn'?t)\s+(here|alive|around)\b/i,
  /\bwon'?t\s+see\s+(another|the\s+next)\s+(year|birthday|christmas)\b/i,
  /\bafter\s+i'?m\s+gone\b/i,
];

const SELF_HARM: RegExp[] = [
  /\bcut(ting)?\s+(my\s*self|me)\b/i,
  /\bhurt(ing)?\s+(my\s*self|me)\s+(on\s+purpose)?\b/i,
  /\bself[-\s]?harm(ing)?\b/i,
  /\bburn(ing)?\s+my\s*self\b/i,
  /\bhitting\s+my\s*self\b/i,
];

const ABUSE: RegExp[] = [
  /\b(my\s+)?(husband|wife|partner|boyfriend|girlfriend|he|she|they)\s+(hits|hit|punches|punched|hurts|hurt|strangl|chok(es?|ed)|beats?|beat|slaps?|slapped)\s+me\b/i,
  /\bi'?m\s+(scared|afraid|terrified)\s+(of|that)\s+(my\s+)?(husband|wife|partner|him|her|them)\b/i,
  /\bafraid\s+(my\s+)?(husband|wife|partner|he|she|they)\s+(will|might|could)\s+(hurt|kill|harm)\s+me\b/i,
  /\b(won'?t|doesn'?t|will\s+not)\s+let\s+me\s+(see|talk\s+to|leave|work|have)\b/i,
  /\bcontrols?\s+(all\s+)?(my|the)\s+money\b/i,
  /\btracks?\s+(my\s+)?(phone|location|movements)\b/i,
  /\blocks?\s+me\s+(in|out)\b/i,
  /\bforces?\s+me\s+to\s+have\s+sex\b/i,
  /\b(rapes?|raped)\s+me\b/i,
  /\b(non[-\s]?consensual|without\s+my\s+consent)\b/i,
  /\bit'?s\s+getting\s+(worse|more\s+violent)\b/i,
  /\b(domestic|partner|intimate\s+partner)\s+(violence|abuse)\b/i,
  /\b(threatened\s+to\s+kill|said\s+he'?ll\s+kill|will\s+kill\s+me)\b/i,
];

const CHILD_SAFETY: RegExp[] = [
  /\bhurt(ing)?\s+(my|the|a)\s+(child|kid|baby|son|daughter|toddler)\b/i,
  /\bwant\s+to\s+(hurt|hit|harm)\s+(my|the)\s+(child|kid|baby|son|daughter)\b/i,
  /\b(child|kid)\s+abuse\b/i,
  /\b(my|the)\s+(child|kid|son|daughter)\s+is\s+(in\s+)?danger\b/i,
  /\bsomeone\s+is\s+(hurting|abusing|touching)\s+(my|a)\s+(child|kid)\b/i,
];

const PSYCHOSIS: RegExp[] = [
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

const SUBSTANCE: RegExp[] = [
  /\boverdose|overdosed|overdosing\b/i,
  /\bod'?(d|ed|ing)\b/i,
  /\b(can'?t|cannot)\s+stop\s+(drinking|using|taking)\b/i,
  /\b(in|going\s+through)\s+withdrawal\b/i,
  /\bdrunk\s+(driving|behind\s+the\s+wheel)\b/i,
  /\b(took|taken)\s+too\s+many\s+(pills?|tablets?|paracetamol|ibuprofen)\b/i,
];

const EATING: RegExp[] = [
  /\bhaven'?t\s+eaten\s+in\s+\d+\s+(day|week)/i,
  /\bstop(ped)?\s+eating\b/i,
  /\bpurg(e|ing|ed)\b/i,
  /\bthrow(ing|n)?\s+up\s+(after|on\s+purpose)\b/i,
  /\bmake\s+myself\s+(throw\s+up|sick)\b/i,
  /\b(anorexi|bulimi)/i,
];

// Highest urgency listed first.
const ORDERED: { category: CrisisCategory; patterns: RegExp[] }[] = [
  { category: "suicide", patterns: SUICIDE },
  { category: "self_harm", patterns: SELF_HARM },
  { category: "child_safety", patterns: CHILD_SAFETY },
  { category: "abuse", patterns: ABUSE },
  { category: "psychosis", patterns: PSYCHOSIS },
  { category: "substance_crisis", patterns: SUBSTANCE },
  { category: "eating_disorder", patterns: EATING },
];

/**
 * Returns the highest-priority matched crisis category, or null.
 * Hypothetical / fictional / joking framings DO NOT bypass this check
 * (the patterns themselves match regardless of frame).
 */
export function detectCrisis(text: string): CrisisCategory | null {
  if (!text) return null;
  for (const { category, patterns } of ORDERED) {
    if (patterns.some((p) => p.test(text))) return category;
  }
  return null;
}

/**
 * Generic, country-agnostic safety message returned by the server when a
 * crisis pattern is detected. Country-specific helplines live client-side
 * (the proxy doesn't know which country the user has selected).
 *
 * Format mimics Anthropic's response shape so the client can consume it
 * without special-casing.
 */
export function safetyResponseBody(category: CrisisCategory) {
  const text = `What you're sharing sounds like more than I can sit with safely. Please reach out to a qualified human — your country's crisis line, or your doctor — right now.

If you are in immediate danger, please call your local emergency number.

I'm going to step back from our conversation. When you're safe and ready, this space will be here.`;
  return {
    id: `safety_${category}_${Date.now()}`,
    type: "message",
    role: "assistant",
    model: "safety-stub",
    content: [{ type: "text", text }],
    stop_reason: "end_turn",
    stop_sequence: null,
    usage: { input_tokens: 0, output_tokens: 0 },
  };
}
