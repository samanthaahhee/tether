/**
 * Scan AI output for accidentally included PII patterns.
 * Redacts matches before the response is stored or displayed.
 */

const PII_PATTERNS: { name: string; regex: RegExp; replacement: string }[] = [
  { name: 'email', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: '[email redacted]' },
  { name: 'phone', regex: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g, replacement: '[phone redacted]' },
  { name: 'ssn', regex: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '[ID redacted]' },
  { name: 'sa_id', regex: /\b\d{13}\b/g, replacement: '[ID redacted]' },
  { name: 'credit_card', regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, replacement: '[card redacted]' },
  { name: 'ip_address', regex: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, replacement: '[IP redacted]' },
];

export function filterPII(text: string): { cleaned: string; piiFound: boolean } {
  let cleaned = text;
  let piiFound = false;

  for (const pattern of PII_PATTERNS) {
    if (pattern.regex.test(cleaned)) {
      piiFound = true;
      cleaned = cleaned.replace(pattern.regex, pattern.replacement);
    }
    // Reset regex lastIndex since we use /g flag
    pattern.regex.lastIndex = 0;
  }

  return { cleaned, piiFound };
}

/**
 * Check AI output for harmful content patterns that should never appear
 * in a relationship wellness context. Returns a safe fallback if detected.
 *
 * IMPORTANT — these patterns are English-only by design. Multilingual
 * jailbreaks work by asking the model to respond in another language to
 * bypass English-language filters exactly like this one. We close that
 * gap at the system-prompt layer by instructing the model to ALWAYS
 * respond in English, regardless of the user's input language (see
 * INJECTION_GUARD in src/hooks/useClaude.ts). If multilingual responses
 * are ever enabled, these patterns MUST be extended to every supported
 * language BEFORE that feature ships.
 */
const HARMFUL_PATTERNS: RegExp[] = [
  /you should (leave|divorce|break up|end (the|your) relationship)/i,
  /your partner is (abusing|gaslighting|narcissist|toxic)/i,
  /you (deserve|need) to (punish|hurt|get (back|revenge|even))/i,
  /prescription|medication|dosage|diagnos(e|is|ed)/i,
  /as (a|your) therapist/i,
  /my (clinical|professional) (opinion|diagnosis|assessment) is/i,
  /you (have|suffer from|are diagnosed with) (depression|anxiety|PTSD|BPD|bipolar)/i,
];

const HARMFUL_FALLBACK = "I want to make sure I'm supporting you well. I'm not a therapist, and some things are best explored with a professional. Would you like to continue sharing how you're feeling?";

export function filterHarmfulContent(text: string): { cleaned: string; wasHarmful: boolean } {
  for (const pattern of HARMFUL_PATTERNS) {
    if (pattern.test(text)) {
      return { cleaned: HARMFUL_FALLBACK, wasHarmful: true };
    }
  }
  return { cleaned: text, wasHarmful: false };
}
