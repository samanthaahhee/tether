/**
 * Sanitise user text input — strip potential injection patterns and limit length.
 *
 * The stripTags pass is defence-in-depth: this project doesn't currently render
 * user text in an HTML context, but future web builds or copy-outs might. The
 * implementation avoids a naive `.replace(/<[^>]*>/g, '')`, which is vulnerable
 * to the nested-tag bypass (`<scr<script>ipt>` → `<script>` after one pass)
 * flagged by CodeQL's `js/incomplete-multi-character-sanitization` rule.
 */
const MAX_INPUT_LENGTH = 5000;

export function sanitiseInput(text: string): string {
  if (!text || typeof text !== 'string') return '';

  // Trim and length-limit first so we don't scan more than necessary.
  let clean = text.trim().slice(0, MAX_INPUT_LENGTH);

  // Remove null bytes (never legal in user input).
  clean = clean.replace(/\0/g, '');

  // Strip anything that looks like an HTML/XML tag using a character-level
  // pass that handles nesting by construction — no regex replace that could
  // leave unbalanced markup behind.
  clean = stripTags(clean);

  return clean;
}

/**
 * Walk the string once, dropping everything between `<` and the next `>`.
 * Nested or overlapping tags can't survive because we track depth and only
 * emit characters when we are not inside any open tag. Unmatched `<` that
 * never close are dropped along with the rest of the input to stay
 * conservative — a user typing `1 < 2` in a relationship-app session is
 * not a meaningful use-case here.
 */
function stripTags(s: string): string {
  let out = '';
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c === 0x3c /* '<' */) {
      depth++;
      continue;
    }
    if (c === 0x3e /* '>' */ && depth > 0) {
      depth--;
      continue;
    }
    if (depth === 0) out += s[i];
  }
  return out;
}

/**
 * Validate that a session ID is a safe string (numeric timestamp)
 */
export function isValidSessionId(id: string): boolean {
  return /^\d{13,}$/.test(id);
}

/**
 * Validate assessment type
 */
const VALID_TYPES = ['attachment', 'love', 'conflict', 'window', 'need'];
export function isValidAssessmentType(type: string): boolean {
  return VALID_TYPES.includes(type);
}
