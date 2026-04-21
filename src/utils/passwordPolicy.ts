/**
 * Password policy for Hey Otis.
 *
 * Client-side validation is a UX convenience — it surfaces a friendly error
 * before the round-trip. The authoritative enforcement lives in the Supabase
 * dashboard (Authentication → Policies → Password). Keep the rules here
 * aligned with the dashboard so users never see a confusing server rejection
 * they passed here.
 *
 * Current dashboard settings (document in SUPABASE-DASHBOARD-CHECKLIST.md):
 *   - Minimum length: 12
 *   - Require: lower, upper, digit, symbol
 */

export interface PasswordCheck {
  ok: boolean;
  error: string | null;
  // Individual rule results — useful for showing inline checklist in UI.
  rules: {
    length: boolean;
    letter: boolean;
    number: boolean;
    symbol: boolean;
    notCommon: boolean;
  };
}

export const PASSWORD_MIN_LENGTH = 12;

// A very small seed list of the most abused passwords. For brand new sign-ups
// this catches the worst offenders without shipping a 100k-word dictionary.
// Server-side checks via Supabase's HIBP integration (when enabled) give
// deeper coverage.
const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', 'p@ssw0rd', 'p@ssword',
  '12345678', '123456789', '1234567890', '11111111', '00000000',
  'qwerty', 'qwerty123', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
  'iloveyou', 'letmein', 'welcome', 'welcome1', 'admin', 'administrator',
  'abc12345', 'abcd1234', 'abcdefgh', 'monkey', 'dragon', 'master',
  'sunshine', 'princess', 'football', 'baseball', 'superman', 'batman',
  'heyotis', 'heyotis123', 'heyotisapp', 'otis1234',
]);

export function checkPassword(raw: string): PasswordCheck {
  const pw = raw ?? '';
  const rules = {
    length: pw.length >= PASSWORD_MIN_LENGTH,
    letter: /[a-zA-Z]/.test(pw),
    number: /\d/.test(pw),
    symbol: /[^a-zA-Z0-9]/.test(pw),
    notCommon: !COMMON_PASSWORDS.has(pw.toLowerCase()),
  };

  if (!rules.length) return { ok: false, error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`, rules };
  if (!rules.letter) return { ok: false, error: 'Password must include at least one letter.', rules };
  if (!rules.number) return { ok: false, error: 'Password must include at least one number.', rules };
  if (!rules.symbol) return { ok: false, error: 'Password must include at least one symbol (e.g. !, ?, #, %).', rules };
  if (!rules.notCommon) return { ok: false, error: 'Please choose a less common password.', rules };
  return { ok: true, error: null, rules };
}

/**
 * Returns a human-readable strength label for UI hints.
 * Not used for validation — only for the strength meter.
 */
export function passwordStrengthLabel(raw: string): 'too short' | 'weak' | 'fair' | 'strong' {
  const pw = raw ?? '';
  if (pw.length < PASSWORD_MIN_LENGTH) return 'too short';
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z0-9]/].filter(r => r.test(pw)).length;
  if (classes <= 2) return 'weak';
  if (classes === 3) return 'fair';
  return 'strong';
}
