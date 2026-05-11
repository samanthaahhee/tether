-- Hey Otis: capture optional demographic + acquisition signal during
-- onboarding so we can understand who is actually using the app and
-- where they're coming from. All fields are nullable text so existing
-- accounts stay valid and so users can decline individual fields.
alter table public.profiles
  add column if not exists gender text,
  add column if not exists country text,
  add column if not exists relationship_status text,
  add column if not exists has_kids text,
  add column if not exists acquisition_source text;

comment on column public.profiles.gender is
  'Self-reported gender identity (woman/man/non-binary/other/prefer-not-to-say). Used for inclusive language in generated content and aggregate demographics.';
comment on column public.profiles.country is
  'Self-reported country of residence (free text, captured during onboarding). Used for aggregate geographic insight only — no per-user targeting.';
comment on column public.profiles.relationship_status is
  'Self-reported relationship structure (dating/engaged/married/cohabiting/long-distance). Tailors session prompts.';
comment on column public.profiles.has_kids is
  'Self-reported parental status bucket (none/with-us/not-with-us). Used to tailor prompts that touch on family dynamics.';
comment on column public.profiles.acquisition_source is
  'How the user heard about Hey Otis. Used for marketing attribution only.';
