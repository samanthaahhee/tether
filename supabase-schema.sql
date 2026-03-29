-- ============================================================
-- Tether — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Profiles (one per user, mirrors auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text default '',
  attachment text default '',
  conflict text default '',
  love text default '',
  "window" text default '',
  need text default '',
  context text default '',
  onboarded boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Couples (links two user accounts)
create table public.couples (
  id uuid default gen_random_uuid() primary key,
  user1_id uuid references auth.users on delete cascade not null,
  user2_id uuid references auth.users on delete cascade not null,
  created_at timestamptz default now(),
  unique(user1_id, user2_id)
);

-- 3. Invite codes
create table public.couple_invites (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  inviter_id uuid references auth.users on delete cascade not null,
  used boolean default false,
  used_by uuid references auth.users,
  expires_at timestamptz default (now() + interval '7 days'),
  created_at timestamptz default now()
);

-- ============================================================
-- Auto-create a profile row when a new user signs up
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================

-- Profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Partners can view each other's profile"
  on public.profiles for select
  using (
    id in (
      select case when user1_id = auth.uid() then user2_id else user1_id end
      from public.couples
      where user1_id = auth.uid() or user2_id = auth.uid()
    )
  );

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Couples
alter table public.couples enable row level security;

create policy "Users can view their couple"
  on public.couples for select
  using (user1_id = auth.uid() or user2_id = auth.uid());

create policy "Users can create a couple"
  on public.couples for insert
  with check (user1_id = auth.uid() or user2_id = auth.uid());

-- Invite codes
alter table public.couple_invites enable row level security;

create policy "Users can create invites"
  on public.couple_invites for insert
  with check (inviter_id = auth.uid());

create policy "Anyone can look up an invite by code"
  on public.couple_invites for select
  using (true);

create policy "Users can mark invite as used"
  on public.couple_invites for update
  using (true);
