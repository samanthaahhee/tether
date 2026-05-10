-- Record explicit terms-of-use acceptance per user. Apple App Review,
-- EU consumer law, and our limitation-of-liability all benefit from
-- evidence that the user actively agreed before they invested any
-- personal data in the product.
--
-- Captured at the start of onboarding (before any profile dimensions
-- are filled in). The version string lets us re-prompt users when we
-- ship a material change to the Terms.

alter table public.profiles
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists terms_version text;

comment on column public.profiles.terms_accepted_at is
  'Timestamp the user explicitly accepted the Terms of Service + Privacy Policy. Set during onboarding, before any profile data is captured.';

comment on column public.profiles.terms_version is
  'Version string of the Terms accepted (e.g. "2026-04-08"). Used to detect when re-acceptance is required after material changes.';
