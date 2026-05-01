/**
 * crisisResponses.ts
 * ────────────────────────────────────────────────────────────────────
 * Categorical crisis response templates for Hey Otis.
 *
 * Used by useClaude.send() when safetyDetect.detectCrisisCategory()
 * returns a non-null category. The response is returned to the user
 * INSTEAD of calling Claude — the LLM is never given the input.
 *
 * Each template:
 *   - Acknowledges the user without diagnosis
 *   - Explicitly steps back from the role of helper
 *   - Provides country-specific helpline resources
 *   - Includes the local emergency number
 *   - Closes with a soft re-entry door
 *
 * Country resources are pulled from src/constants/crisisLines.ts so we
 * have a single source of truth for the helpline directory.
 *
 * Templates are intentionally short — when someone is in crisis, they
 * need clarity, not paragraphs.
 * ────────────────────────────────────────────────────────────────────
 */

import { CrisisCategory } from './safetyDetect';
import { CRISIS_COUNTRIES, getCrisisLines } from '../constants/crisisLines';

// Country code → local emergency number. Used as the universal "if you
// are in immediate danger" line at the bottom of every crisis response.
const EMERGENCY_NUMBERS: Record<string, string> = {
  international: '112 in the EU, 911 in North America, 000 in Australia',
  us: '911',
  gb: '999',
  ca: '911',
  au: '000',
  nz: '111',
  za: '10111',
  in: '112',
  ie: '999',
  de: '112',
  fr: '112',
  nl: '112',
  br: '190',
  mx: '911',
  jp: '110',
  ph: '911',
  sg: '999',
  ke: '999',
  ng: '112',
  ae: '999',
};

function emergencyLineFor(countryCode: string): string {
  return EMERGENCY_NUMBERS[countryCode] || EMERGENCY_NUMBERS.international;
}

/**
 * Format the country's helplines for inclusion in a response.
 * We surface up to the most relevant 3 lines per country to keep
 * the response readable.
 */
function helplineBlock(countryCode: string, category: CrisisCategory): string {
  const country = getCrisisLines(countryCode);

  // Filter for the most relevant lines per category. We use simple keyword
  // matching against line names/notes — not perfect, but good enough to
  // surface DV lines for abuse, etc., when the country has them.
  const relevanceKeyword = ({
    suicide: /suicide|crisis|lifeline|samaritan|telefonseelsorge|113|988|sos|cvv|vandrevala|tell|hopeline|saptel|need\s+to\s+talk/i,
    self_harm: /suicide|crisis|lifeline|samaritan|telefonseelsorge|113|988|sos|cvv|vandrevala|tell|hopeline|saptel|need\s+to\s+talk/i,
    abuse: /abuse|dv|domestic|violence|refuge|hilfe|respect|women|gbv|slacht/i,
    child_safety: /kids?|child|youth|gbv|abuse/i,
    psychosis: /crisis|lifeline|samaritan|telefonseelsorge|988|113|imh/i,
    substance_crisis: /samhsa|frank|substance|drug|sucht|brijder/i,
    eating_disorder: /crisis|lifeline|samaritan|113|988/i,
  } as Record<CrisisCategory, RegExp>)[category];

  const relevant = country.lines.filter(
    (l) => relevanceKeyword.test(l.name) || relevanceKeyword.test(l.note),
  );
  // Fall back to first 3 lines if no relevant match (e.g. small country).
  const lines = (relevant.length > 0 ? relevant : country.lines).slice(0, 3);

  return lines
    .map((l) => `  • ${country.flag ? `${country.flag} ` : ''}${l.name}: ${l.note}`)
    .join('\n');
}

const TEMPLATES: Record<CrisisCategory, (countryCode: string) => string> = {
  suicide: (countryCode) => `What you're carrying right now sounds really heavy, and I want to make sure you're safe. I'm not the right kind of support for moments like this — please talk to someone who can be with you right now.

${helplineBlock(countryCode, 'suicide')}

If you are in immediate danger, please call your local emergency number (${emergencyLineFor(countryCode)}).

I'm going to step back from our usual conversation. When you're safe and you want to come back, this space will be here.`,

  self_harm: (countryCode) => `What you're going through deserves more support than I can give. Please reach out to someone trained to help right now:

${helplineBlock(countryCode, 'self_harm')}

If you are in immediate danger, please call ${emergencyLineFor(countryCode)}.

I'm going to step back. When you're ready and supported, you can come back here.`,

  abuse: (countryCode) => `What you're describing isn't okay, and it's not your fault. Your safety matters more than anything we could talk through here.

Please reach out to someone trained to help:

${helplineBlock(countryCode, 'abuse')}

If you are in immediate danger, please call ${emergencyLineFor(countryCode)}.

Hey Otis is built for everyday relationship moments. The situation you're in needs someone who can support you in person and help you stay safe.`,

  child_safety: (countryCode) => `What you're describing involves a child, and that needs more than I can do. Please reach out to someone who can act on this:

${helplineBlock(countryCode, 'child_safety')}

If a child is in immediate danger, please call ${emergencyLineFor(countryCode)}.`,

  psychosis: (countryCode) => `What you're going through sounds really intense, and you deserve support that's stronger than what I can offer. Please talk to a doctor, a therapist, or a crisis line as soon as you can:

${helplineBlock(countryCode, 'psychosis')}

If you are in immediate danger or unable to keep yourself safe, please call ${emergencyLineFor(countryCode)}.`,

  substance_crisis: (countryCode) => `Substance use needs proper support — more than I can offer. Please reach out:

${helplineBlock(countryCode, 'substance_crisis')}

If this is an emergency (overdose, withdrawal, immediate danger), please call ${emergencyLineFor(countryCode)} now.`,

  eating_disorder: (countryCode) => `What you're describing about food and your body deserves real, qualified support. Please reach out:

${helplineBlock(countryCode, 'eating_disorder')}

If this is an emergency, please call ${emergencyLineFor(countryCode)}.`,
};

/**
 * Returns the full crisis response message for a given category and
 * the user's currently-set crisis country (from app state).
 *
 * Falls back to the 'international' country code if the user hasn't
 * picked one — that surfaces befrienders.org and IASP for global
 * coverage.
 */
export function getCrisisResponse(
  category: CrisisCategory,
  countryCode: string,
): string {
  const cc = CRISIS_COUNTRIES.some((c) => c.code === countryCode)
    ? countryCode
    : 'international';
  return TEMPLATES[category](cc);
}

/**
 * Short, human label for a category. Used in audit-log details so an
 * analyst can scan flagged events without looking up enum values.
 */
export function categoryLabel(category: CrisisCategory): string {
  return ({
    suicide: 'Suicide / suicidal ideation',
    self_harm: 'Self-harm',
    abuse: 'Domestic violence / partner abuse',
    child_safety: 'Child safety',
    psychosis: 'Psychosis / dissociation',
    substance_crisis: 'Substance crisis',
    eating_disorder: 'Eating disorder crisis',
  } as Record<CrisisCategory, string>)[category];
}
