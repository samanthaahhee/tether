-- Onboarding now collects date-of-birth via a calendar input rather
-- than a free-text age. dob is the source of truth; the existing
-- `age` text column stays for legacy rows + backwards-compat reads
-- but is auto-computed from dob client-side going forward.

alter table public.profiles
  add column if not exists dob date;

comment on column public.profiles.dob is
  'Date of birth captured during onboarding via the date picker. Source of truth for age. The legacy `age` text column is now redundant for new rows but retained for older accounts that pre-date this column.';
