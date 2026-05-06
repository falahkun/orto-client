# Americano Pro Tracker - Database Schema

This document outlines the Supabase PostgreSQL database schema, including tables, relationships, and Row Level Security (RLS) policies.

## 1. Tables

### `profiles`
Extends the default Supabase Auth `users` table to store application-specific user data.

- `id` (uuid, primary key, references `auth.users(id)`)
- `username` (text, unique, not null)
- `email` (text, not null)
- `created_at` (timestamp with time zone, default `now()`)

### `sessions`
Represents a "Play Session" created by a user.

- `id` (uuid, primary key, default `uuid_generate_v4()`)
- `user_id` (uuid, not null, references `profiles(id)`)
- `name` (text, optional)
- `status` (text, default `'setup'`) - e.g., 'setup', 'active', 'completed'
- `target_matches_per_player` (integer, default 4)
- `duration_minutes` (integer, default 10)
- `created_at` (timestamp with time zone, default `now()`)

### `players`
Represents a player participating in a specific session.

- `id` (uuid, primary key, default `uuid_generate_v4()`)
- `session_id` (uuid, not null, references `sessions(id)` on delete cascade)
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
- `created_at` (timestamp with time zone, default `now()`)

---

## 2. SQL Schema & RLS Policies

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

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

-- Create a trigger to automatically create a profile for new users
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, username)
  values (new.id, new.email, new.raw_user_meta_data->>'username');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==========================================
-- SESSIONS
-- ==========================================
create table public.sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
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
create table public.players (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.sessions(id) on delete cascade not null,
  name text not null,
  matches_played integer default 0 not null,
  total_points integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.players enable row level security;

-- Users can access players if they own the session
create policy "Users can manage players of their sessions"
  on players for all
  using ( exists (select 1 from sessions where id = players.session_id and user_id = auth.uid()) );


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
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.matches enable row level security;

-- Users can access matches if they own the session
create policy "Users can manage matches of their sessions"
  on matches for all
  using ( exists (select 1 from sessions where id = matches.session_id and user_id = auth.uid()) );
```
uid()) );
```
