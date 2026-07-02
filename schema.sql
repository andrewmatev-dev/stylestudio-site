-- StyleStudio database schema
-- Safe to run more than once — every statement checks "if not exists"
-- or drops-then-recreates policies, so re-running after a partial
-- failure will not error out on "already exists".

-- ============ Tables ============

-- User profiles (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  gender_pref text default 'any',
  bio text default '',
  photo_url text default '',
  is_public boolean default true,
  created_at timestamp with time zone default now()
);

-- Closet items
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  brand text default '',
  name text not null,
  type text not null,
  color text,
  color_hex text,
  pattern text,
  material text,
  formality int,
  style_tags text[],
  occasions text[],
  seasons text[],
  image_path text not null,        -- path in Supabase Storage
  wear_count int default 0,
  last_worn timestamptz,
  created_at timestamp with time zone default now()
);

create index if not exists items_user_id_idx on public.items(user_id);
create index if not exists items_type_idx on public.items(type);

-- Saved outfits (private to user)
create table if not exists public.outfits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  vibe text,
  styling_tip text,
  item_ids uuid[] not null,
  occasion text not null,
  signature text not null,         -- unique key for dedup: occasion + sorted item_ids
  created_at timestamp with time zone default now()
);

create index if not exists outfits_user_id_idx on public.outfits(user_id);
create unique index if not exists outfits_user_signature_idx on public.outfits(user_id, signature);

-- Public community posts
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete cascade not null,
  author_name text not null,        -- snapshot of display name at post time
  title text not null,
  vibe text,
  styling_tip text,
  occasion text not null,
  items jsonb not null,             -- snapshot of items with image URLs
  likes int default 0,
  created_at timestamp with time zone default now()
);

create index if not exists posts_created_at_idx on public.posts(created_at desc);
create index if not exists posts_occasion_idx on public.posts(occasion);

-- Likes (tracks which user liked which post, prevents duplicate likes)
create table if not exists public.post_likes (
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  primary key (post_id, user_id)
);

-- Comments on Inspire posts
create table if not exists public.comments (
  id text primary key,
  post_id uuid references public.posts(id) on delete cascade,
  author_id uuid references auth.users(id) on delete cascade,
  author_name text not null,
  text text not null,
  created_at timestamptz default now()
);

create index if not exists comments_post_idx on public.comments(post_id);

-- Generic per-user key/value preferences
-- (profile_bio, profile_photo, default_public, saved_board,
--  rejected_outfits, gender_pref, display_name, etc.)
create table if not exists public.user_prefs (
  user_id uuid references auth.users(id) on delete cascade,
  key text not null,
  value text,
  updated_at timestamptz default now(),
  primary key (user_id, key)
);

-- ============ Row Level Security ============

alter table public.profiles      enable row level security;
alter table public.items         enable row level security;
alter table public.outfits       enable row level security;
alter table public.posts         enable row level security;
alter table public.post_likes    enable row level security;
alter table public.comments      enable row level security;
alter table public.user_prefs    enable row level security;

-- Profiles: users can see/edit only their own
drop policy if exists "Profiles are viewable by owner" on profiles;
create policy "Profiles are viewable by owner" on profiles
  for select using (auth.uid() = id);
drop policy if exists "Profiles are editable by owner" on profiles;
create policy "Profiles are editable by owner" on profiles
  for all using (auth.uid() = id);

-- Items: private to owner
drop policy if exists "Items viewable by owner" on items;
create policy "Items viewable by owner" on items
  for select using (auth.uid() = user_id);
drop policy if exists "Items insertable by owner" on items;
create policy "Items insertable by owner" on items
  for insert with check (auth.uid() = user_id);
drop policy if exists "Items updatable by owner" on items;
create policy "Items updatable by owner" on items
  for update using (auth.uid() = user_id);
drop policy if exists "Items deletable by owner" on items;
create policy "Items deletable by owner" on items
  for delete using (auth.uid() = user_id);

-- Outfits: private to owner
drop policy if exists "Outfits viewable by owner" on outfits;
create policy "Outfits viewable by owner" on outfits
  for select using (auth.uid() = user_id);
drop policy if exists "Outfits insertable by owner" on outfits;
create policy "Outfits insertable by owner" on outfits
  for insert with check (auth.uid() = user_id);
drop policy if exists "Outfits deletable by owner" on outfits;
create policy "Outfits deletable by owner" on outfits
  for delete using (auth.uid() = user_id);

-- Posts: public read, only author can write/delete
drop policy if exists "Posts are viewable by everyone" on posts;
create policy "Posts are viewable by everyone" on posts
  for select using (true);
drop policy if exists "Posts insertable by author" on posts;
create policy "Posts insertable by author" on posts
  for insert with check (auth.uid() = author_id);
drop policy if exists "Posts deletable by author" on posts;
create policy "Posts deletable by author" on posts
  for delete using (auth.uid() = author_id);

-- Likes: anyone authenticated can like; can only un-like own likes
drop policy if exists "Likes viewable by everyone" on post_likes;
create policy "Likes viewable by everyone" on post_likes
  for select using (true);
drop policy if exists "Likes insertable by self" on post_likes;
create policy "Likes insertable by self" on post_likes
  for insert with check (auth.uid() = user_id);
drop policy if exists "Likes deletable by self" on post_likes;
create policy "Likes deletable by self" on post_likes
  for delete using (auth.uid() = user_id);

-- Comments: public read, only author can write/delete
drop policy if exists "Comments viewable by everyone" on comments;
create policy "Comments viewable by everyone" on comments
  for select using (true);
drop policy if exists "Comments insertable by author" on comments;
create policy "Comments insertable by author" on comments
  for insert with check (auth.uid() = author_id);
drop policy if exists "Comments deletable by author" on comments;
create policy "Comments deletable by author" on comments
  for delete using (auth.uid() = author_id);

-- User prefs: private to owner
drop policy if exists "Prefs viewable by owner" on user_prefs;
create policy "Prefs viewable by owner" on user_prefs
  for select using (auth.uid() = user_id);
drop policy if exists "Prefs upsertable by owner" on user_prefs;
create policy "Prefs upsertable by owner" on user_prefs
  for insert with check (auth.uid() = user_id);
drop policy if exists "Prefs updatable by owner" on user_prefs;
create policy "Prefs updatable by owner" on user_prefs
  for update using (auth.uid() = user_id);
drop policy if exists "Prefs deletable by owner" on user_prefs;
create policy "Prefs deletable by owner" on user_prefs
  for delete using (auth.uid() = user_id);

-- ============ Storage bucket for clothing photos ============
-- Run this in Supabase Storage UI: create bucket named "items", PRIVATE.
-- Then add this policy:

-- Policy on storage.objects:
-- name: "Users can manage their own item images"
-- bucket: items
-- operations: select, insert, update, delete
-- expression: (storage.foldername(name))[1] = auth.uid()::text

-- Files will be uploaded with path: {user_id}/{item_id}.jpg

-- ============ Profile auto-create trigger ============

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ Atomic like increment (RPC) ============
-- Used to safely increment/decrement post likes counter

create or replace function public.toggle_post_like(p_post_id uuid)
returns int as $$
declare
  v_user uuid := auth.uid();
  v_exists boolean;
  v_count int;
begin
  if v_user is null then
    raise exception 'Not authenticated';
  end if;

  select exists(
    select 1 from public.post_likes where post_id = p_post_id and user_id = v_user
  ) into v_exists;

  if v_exists then
    delete from public.post_likes where post_id = p_post_id and user_id = v_user;
    update public.posts set likes = greatest(0, likes - 1) where id = p_post_id
      returning likes into v_count;
  else
    insert into public.post_likes(post_id, user_id) values (p_post_id, v_user);
    update public.posts set likes = likes + 1 where id = p_post_id
      returning likes into v_count;
  end if;

  return v_count;
end;
$$ language plpgsql security definer;
