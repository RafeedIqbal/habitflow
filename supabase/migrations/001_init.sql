-- HabitFlow Database Schema
-- Migration 001: Initial setup

-- habits table
create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  emoji text not null default '✅',
  created_at timestamptz default now() not null
);

-- habit_logs table (one row per habit per completed day)
create table if not exists habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references habits(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  completed_date date not null,
  created_at timestamptz default now() not null,
  unique(habit_id, completed_date)
);

-- Enable Row Level Security
alter table habits enable row level security;
alter table habit_logs enable row level security;

-- RLS policies for habits
create policy "Users can view their own habits"
  on habits for select
  using (auth.uid() = user_id);

create policy "Users can insert their own habits"
  on habits for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own habits"
  on habits for update
  using (auth.uid() = user_id);

create policy "Users can delete their own habits"
  on habits for delete
  using (auth.uid() = user_id);

-- RLS policies for habit_logs
create policy "Users can view their own habit logs"
  on habit_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own habit logs"
  on habit_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own habit logs"
  on habit_logs for delete
  using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists habits_user_id_idx on habits(user_id);
create index if not exists habit_logs_habit_id_idx on habit_logs(habit_id);
create index if not exists habit_logs_user_id_date_idx on habit_logs(user_id, completed_date);
