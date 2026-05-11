-- Hey Otis: capture lightweight demographic + relationship-length signal during
-- onboarding. Both nullable text so older accounts that pre-date this column
-- don't break, and so we can store ranges (e.g. "1-3 years") not raw integers.
alter table public.profiles
  add column if not exists age text,
  add column if not exists together_for text;

comment on column public.profiles.age is
  'Self-reported age as captured during onboarding. Free-text to allow ranges; not used for any age-restricted logic — the 18+ check is in the consent gate.';
comment on column public.profiles.together_for is
  'Self-reported relationship length bucket selected during onboarding (e.g. "<6 months", "1-3 years"). Used to tailor session prompts.';
