# Quotidian — Database Schema

Run these SQL statements in your Supabase SQL Editor (in order).

> Note: There is NO `daily_quotes` table. Each user's daily quote is stored
> in their own browser's localStorage — no database or server needed for it.

---

## Tables

### 1. quotes
Stores all quotes imported from the dataset. This is the main quotes source.
Already created and populated — listed here for reference.

```sql
create table quotes (
  id       uuid primary key default gen_random_uuid(),
  content  text not null,
  author   text not null,
  tags     text[] default '{}',
  language text default 'en'
);

-- Full text search index (run this if not already created)
create index idx_quotes_fts on quotes
using gin(to_tsvector('english', content || ' ' || author));

-- Random quote performance index
create index idx_quotes_random on quotes(id);
```

RLS note: The `quotes` table is public read — anyone can read quotes,
no login required. No RLS policies needed on this table since it's
read-only public data. The Edge Functions use the anon key to read it.

```sql
-- Allow anyone to read quotes (run this)
alter table quotes enable row level security;

create policy "Anyone can read quotes"
  on quotes for select
  using (true);
```

### 2. saved_quotes
Stores quotes a user has saved to their favourites.

```sql
create table saved_quotes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  content    text not null,
  author     text not null,
  tags       text[] default '{}',
  source_id  text,
  saved_at   timestamptz default now()
);

-- Index for fast user lookups
create index idx_saved_quotes_user on saved_quotes(user_id);

-- Prevent duplicate saves (same user, same source quote)
create unique index idx_saved_quotes_unique
  on saved_quotes(user_id, source_id)
  where source_id is not null;
```

### 2. profiles
Extended user info. Auto-created when a user signs up.

```sql
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  avatar_url    text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
```

---

## Row Level Security (RLS)

RLS ensures users can only access their own data.
Enable it on both tables and add the policies below.

```sql
-- Enable RLS
alter table saved_quotes  enable row level security;
alter table profiles      enable row level security;


-- saved_quotes: users can only see and manage their own rows
create policy "Users can read own saved quotes"
  on saved_quotes for select
  using (auth.uid() = user_id);

create policy "Users can insert own saved quotes"
  on saved_quotes for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own saved quotes"
  on saved_quotes for delete
  using (auth.uid() = user_id);


-- profiles: users can read/update only their own profile
create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);
```

---

## Trigger: Auto-create profile on signup

When a new user signs up, automatically create a row in `profiles`.

```sql
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

---

## Relationships Diagram

```
auth.users (managed by Supabase)
    │
    ├──< profiles       (1 user → 1 profile, auto-created on signup)
    │
    └──< saved_quotes   (1 user → many saved quotes)

quotes              (public read-only, ~500k rows, imported from dataset)
Quote of the day    → random row from quotes table, cached in localStorage
```

---

## Notes

- `quotes` table has ~500k rows imported from a Kaggle dataset. It is
  read-only public data — no user can insert or modify it. Only the
  Supabase service role (Edge Functions) reads from it.

- `source_id` on `saved_quotes` is the UUID from the `quotes` table.
  Used to detect if a user already saved that quote and to prevent duplicates.
  Quotes without a source_id can still be saved — the unique index only applies
  when source_id is not null.

- `tags` on `saved_quotes` is stored as a Postgres array (`text[]`).

- All timestamps use `timestamptz` (timezone-aware). Supabase stores everything
  in UTC. Convert to local time in the frontend.
