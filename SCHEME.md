# Americano Pro Tracker - Database Schema

This document outlines the Supabase PostgreSQL database schema, including tables, relationships, and Row Level Security (RLS) policies.

## 1. Tables

### `plans`
Defines feature limitations for different subscription levels.

- `id` (text, primary key) - e.g., 'free', 'starter', 'pro'
- `name` (text, not null)
- `price_monthly` (integer) - Price in IDR
- `max_communities` (integer)
- `max_members_per_community` (integer)
- `max_guests_per_session` (integer)
- `max_matches_per_session` (integer)

### `plan_benefits`
Display text for plan features.

- `id` (uuid, primary key)
- `plan_id` (text, references `plans(id)`)
- `benefit_text` (text)
- `is_included` (boolean)

### `profiles`
Extends the default Supabase Auth `users` table to store application-specific user data.

- `id` (uuid, primary key, references `auth.users(id)`)
- `username` (text, unique, not null)
- `email` (text, not null)
- `hobbies` (text array, default `{}`)
- `onboarding_completed` (boolean, default `false`)
- `created_at` (timestamp with time zone, default `now()`)

### `subscriptions`
Tracks active user plans and subscription status.

- `id` (uuid, primary key)
- `user_id` (uuid, references `profiles(id)`)
- `plan_id` (text, references `plans(id)`)
- `status` (text) - e.g., 'active', 'canceled'
- `current_period_end` (timestamp)
- `created_at` (timestamp)

### `communities`
Represents a group or community created by a user.

- `id` (uuid, primary key, default `uuid_generate_v4()`)
- `user_id` (uuid, not null, references `profiles(id)`)
- `name` (text, not null)
- `description` (text, optional)
- `created_at` (timestamp with time zone, default `now()`)

### `sessions`
Represents a "Play Session" created by a user within a community.

- `id` (uuid, primary key, default `uuid_generate_v4()`)
- `user_id` (uuid, not null, references `profiles(id)`)
- `community_id` (uuid, references `communities(id)` on delete cascade)
- `name` (text, optional)
- `status` (text, default `'setup'`) - e.g., 'setup', 'active', 'completed'
- `target_matches_per_player` (integer, default 4)
- `duration_minutes` (integer, default 10)
- `created_at` (timestamp with time zone, default `now()`)

### `community_members`
Represents a consistent member of a community.

- `id` (uuid, primary key, default `uuid_generate_v4()`)
- `community_id` (uuid, not null, references `communities(id)` on delete cascade)
- `name` (text, not null)
- `created_at` (timestamp with time zone, default `now()`)

### `players`
Represents a player participating in a specific session. Can be linked to a community member or be a guest.

- `id` (uuid, primary key, default `uuid_generate_v4()`)
- `session_id` (uuid, not null, references `sessions(id)` on delete cascade)
- `community_member_id` (uuid, references `community_members(id)` on delete set null)
- `name` (text, not null)
- `matches_played` (integer, default 0)
- `total_points` (integer, default 0)
- `created_at` (timestamp with time zone, default `now()`)

### `matches`
Represents a specific match within a session.

- `id` (uuid, primary key, default `uuid_generate_v4()`)
- `session_id` (uuid, not null, references `sessions(id)` on delete cascade)
- `index` (integer, not null)
- `team_a_player1_id` (uuid, references `players(id)`)
- `team_a_player2_id` (uuid, references `players(id)`)
- `team_b_player1_id` (uuid, references `players(id)`)
- `team_b_player2_id` (uuid, references `players(id)`)
- `score_a` (integer, default null)
- `score_b` (integer, default null)
- `status` (text, default `'pending'`) - e.g., 'pending', 'active', 'completed'
- `match_start_at` (timestamp with time zone, optional)
- `match_end_at` (timestamp with time zone, optional)
- `created_at` (timestamp with time zone, default `now()`)

---

## 2. SQL Schema & RLS Policies

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- PLANS
-- ==========================================
create table public.plans (
  id text primary key,
  name text not null,
  price_id text, -- For Stripe/Payment integration
  price_monthly integer not null default 0,
  max_communities integer not null,
  max_members_per_community integer not null,
  max_guests_per_session integer not null,
  max_matches_per_session integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.plans enable row level security;

create policy "Plans are viewable by everyone."
  on plans for select
  using ( true );

-- Plan Benefits for display
create table public.plan_benefits (
  id uuid default uuid_generate_v4() primary key,
  plan_id text references public.plans(id) on delete cascade not null,
  benefit_text text not null,
  is_included boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.plan_benefits enable row level security;

create policy "Plan benefits are viewable by everyone."
  on plan_benefits for select
  using ( true );

-- Seed Data
insert into public.plans (id, name, price_monthly, max_communities, max_members_per_community, max_guests_per_session, max_matches_per_session)
values 
  ('free', 'Free', 0, 1, 10, 4, 10),
  ('starter', 'Starter', 49000, 3, 25, 10, 25),
  ('pro', 'Pro', 99000, 10, 100, 50, 100)
on conflict (id) do update set
  name = excluded.name,
  price_monthly = excluded.price_monthly,
  max_communities = excluded.max_communities,
  max_members_per_community = excluded.max_members_per_community,
  max_guests_per_session = excluded.max_guests_per_session,
  max_matches_per_session = excluded.max_matches_per_session;

-- Seed Benefits
insert into public.plan_benefits (plan_id, benefit_text)
values 
  ('free', '1 Komunitas'),
  ('free', '10 Anggota per Komunitas'),
  ('free', '4 Guest per Sesi'),
  ('free', 'Riwayat Sesi Terbatas'),
  ('starter', '3 Komunitas'),
  ('starter', '25 Anggota per Komunitas'),
  ('starter', '10 Guest per Sesi'),
  ('starter', 'Statistik Pemain Dasar'),
  ('pro', '10 Komunitas'),
  ('pro', '100 Anggota per Komunitas'),
  ('pro', 'Unlimited Guest'),
  ('pro', 'Prioritas Support'),
  ('pro', 'Statistik Lanjutan & Export');


-- ==========================================
-- PROFILES
-- ==========================================
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique not null,
  email text not null,
  hobbies text[] default '{}',
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile."
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- ==========================================
-- SUBSCRIPTIONS
-- ==========================================
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan_id text references public.plans(id) not null default 'free',
  status text not null default 'active', -- active, trialing, canceled, past_due
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

alter table public.subscriptions enable row level security;

create policy "Users can view their own subscription."
  on subscriptions for select
  using ( auth.uid() = user_id );

-- Create a trigger to automatically create a profile and default subscription for new users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Create Profile
  insert into public.profiles (id, email, username)
  values (new.id, new.email, new.raw_user_meta_data->>'username');
  
  -- Create Default Free Subscription
  insert into public.subscriptions (user_id, plan_id, status)
  values (new.id, 'free', 'active');
  
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==========================================
-- LIMITATION HELPERS
-- ==========================================

-- Get Max Communities for a user
create or replace function public.get_max_communities(p_user_id uuid)
returns integer as $$
  select max_communities from public.plans 
  where id = (select plan_id from public.subscriptions where user_id = p_user_id);
$$ language sql stable security definer;

-- Get Max Members for a community
create or replace function public.get_max_members(p_community_id uuid)
returns integer as $$
  select max_members_per_community from public.plans 
  where id = (select plan_id from public.subscriptions where user_id = (select user_id from public.communities where id = p_community_id));
$$ language sql stable security definer;

-- Get Max Guests for a session
create or replace function public.get_max_guests(p_session_id uuid)
returns integer as $$
  select max_guests_per_session from public.plans 
  where id = (select plan_id from public.subscriptions where user_id = (select user_id from public.sessions where id = p_session_id));
$$ language sql stable security definer;

-- Get Max Matches for a session
create or replace function public.get_max_matches(p_session_id uuid)
returns integer as $$
  select max_matches_per_session from public.plans 
  where id = (select plan_id from public.subscriptions where user_id = (select user_id from public.sessions where id = p_session_id));
$$ language sql stable security definer;


-- ==========================================
-- COMMUNITIES
-- ==========================================
create table public.communities (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.communities enable row level security;

create policy "Users can select their own communities"
  on communities for select
  using ( auth.uid() = user_id );

create policy "Users can insert communities within limits"
  on communities for insert
  with check ( 
    auth.uid() = user_id AND 
    (select count(*) from public.communities where user_id = auth.uid()) < public.get_max_communities(auth.uid())
  );

create policy "Users can update their own communities"
  on communities for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own communities"
  on communities for delete
  using ( auth.uid() = user_id );


-- ==========================================
-- SESSIONS
-- ==========================================
create table public.sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  community_id uuid references public.communities(id) on delete cascade,
  name text,
  status text default 'setup'::text not null,
  target_matches_per_player integer default 4 not null,
  duration_minutes integer default 10 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.sessions enable row level security;

create policy "Users can manage their own sessions"
  on sessions for all
  using ( auth.uid() = user_id );


-- ==========================================
-- PLAYERS
-- ==========================================
-- 1. Community Members
create table public.community_members (
  id uuid default uuid_generate_v4() primary key,
  community_id uuid references public.communities(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.community_members enable row level security;

create policy "Users can select community members"
  on community_members for select
  using ( exists (select 1 from communities where id = community_members.community_id and user_id = auth.uid()) );

create policy "Users can insert community members within limits"
  on community_members for insert
  with check ( 
    exists (select 1 from communities where id = community_id and user_id = auth.uid()) AND
    (select count(*) from public.community_members where community_id = community_members.community_id) < public.get_max_members(community_id)
  );

create policy "Users can update community members"
  on community_members for update
  using ( exists (select 1 from communities where id = community_members.community_id and user_id = auth.uid()) );

create policy "Users can delete community members"
  on community_members for delete
  using ( exists (select 1 from communities where id = community_members.community_id and user_id = auth.uid()) );


-- 2. Session Players
create table public.players (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.sessions(id) on delete cascade not null,
  community_member_id uuid references public.community_members(id) on delete set null,
  name text not null,
  matches_played integer default 0 not null,
  total_points integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.players enable row level security;

create policy "Users can manage players of their sessions"
  on players for all
  using ( exists (select 1 from sessions where id = players.session_id and user_id = auth.uid()) );

-- Additional check for guest limits on insert
create or replace function public.enforce_guest_limit()
returns trigger as $$
begin
  if new.community_member_id is null then
    if (select count(*) from public.players where session_id = new.session_id and community_member_id is null) >= public.get_max_guests(new.session_id) then
      raise exception 'Guest limit exceeded for this session';
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger tr_enforce_guest_limit
before insert on public.players
for each row execute function public.enforce_guest_limit();


-- ==========================================
-- MATCHES
-- ==========================================
create table public.matches (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.sessions(id) on delete cascade not null,
  index integer not null,
  team_a_player1_id uuid references public.players(id),
  team_a_player2_id uuid references public.players(id),
  team_b_player1_id uuid references public.players(id),
  team_b_player2_id uuid references public.players(id),
  score_a integer,
  score_b integer,
  status text default 'pending'::text not null,
  match_start_at timestamp with time zone,
  match_end_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.matches enable row level security;

create policy "Users can manage matches of their sessions"
  on matches for all
  using ( exists (select 1 from sessions where id = matches.session_id and user_id = auth.uid()) );

-- Additional check for match limits on insert
create or replace function public.enforce_match_limit()
returns trigger as $$
begin
  if (select count(*) from public.matches where session_id = new.session_id) >= public.get_max_matches(new.session_id) then
    raise exception 'Match limit exceeded for this session';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger tr_enforce_match_limit
before insert on public.matches
for each row execute function public.enforce_match_limit();
```
