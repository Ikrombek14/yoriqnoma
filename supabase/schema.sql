-- =============================================================
--  Yo'riqnoma Dashboard — ma'lumotlar bazasi sxemasi
--  Supabase SQL Editor'ga to'liq nusxa ko'chirib ishga tushiring.
-- =============================================================

-- ---------- PROFILES (foydalanuvchilar + rollar) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'viewer' check (role in ('admin','viewer')),
  created_at timestamptz not null default now()
);

-- Yangi auth foydalanuvchi yaratilganda profil avtomatik ochiladi
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- SECTIONS (navigatsiya daraxti) ----------
create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.sections(id) on delete cascade,
  title text not null,
  slug text not null unique,
  icon text,
  description text,
  type text not null default 'content' check (type in ('content','tests','todo','roadmap')),
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- ARTICLES (matnli kontent) ----------
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections(id) on delete cascade,
  title text not null,
  body text not null default '',
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- VIDEOS ----------
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  title text,
  kind text not null default 'embed' check (kind in ('embed','upload')),
  url text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- TESTS (o'z-o'zini baholash) ----------
create table if not exists public.tests (
  id uuid primary key default gen_random_uuid(),
  section_id uuid references public.sections(id) on delete set null,
  title text not null,
  description text,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.test_questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.tests(id) on delete cascade,
  question text not null,
  options jsonb not null default '[]'::jsonb,
  correct_index int not null default 0,
  position int not null default 0
);

-- Test urinishlari (ixtiyoriy tarix)
create table if not exists public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.tests(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score int not null,
  created_at timestamptz not null default now()
);

-- ---------- TO-DO LIST ----------
create table if not exists public.todo_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.todo_completions (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id uuid not null references public.todo_items(id) on delete cascade,
  done boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

-- ---------- CAREER ROADMAP ----------
create table if not exists public.roadmap_stages (
  id uuid primary key default gen_random_uuid(),
  track text not null check (track in ('administrative','sales')),
  title text not null,
  description text,
  requirements text,
  level int not null default 1,
  position int not null default 0
);

-- =============================================================
--  RLS (Row Level Security) — o'qish hamma uchun (login bo'lganlar),
--  yozish faqat adminlar uchun.
-- =============================================================

alter table public.profiles          enable row level security;
alter table public.sections          enable row level security;
alter table public.articles          enable row level security;
alter table public.videos            enable row level security;
alter table public.tests             enable row level security;
alter table public.test_questions    enable row level security;
alter table public.test_attempts     enable row level security;
alter table public.todo_items        enable row level security;
alter table public.todo_completions  enable row level security;
alter table public.roadmap_stages    enable row level security;

-- Admin tekshiruvi uchun yordamchi funksiya
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ----- PROFILES -----
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ----- Kontent jadvallari uchun umumiy makros -----
-- O'qish: tizimga kirgan har qanday foydalanuvchi. Yozish: admin.

-- SECTIONS
drop policy if exists "sections_read" on public.sections;
create policy "sections_read" on public.sections
  for select using (auth.role() = 'authenticated');
drop policy if exists "sections_write" on public.sections;
create policy "sections_write" on public.sections
  for all using (public.is_admin()) with check (public.is_admin());

-- ARTICLES
drop policy if exists "articles_read" on public.articles;
create policy "articles_read" on public.articles
  for select using (auth.role() = 'authenticated');
drop policy if exists "articles_write" on public.articles;
create policy "articles_write" on public.articles
  for all using (public.is_admin()) with check (public.is_admin());

-- VIDEOS
drop policy if exists "videos_read" on public.videos;
create policy "videos_read" on public.videos
  for select using (auth.role() = 'authenticated');
drop policy if exists "videos_write" on public.videos;
create policy "videos_write" on public.videos
  for all using (public.is_admin()) with check (public.is_admin());

-- TESTS
drop policy if exists "tests_read" on public.tests;
create policy "tests_read" on public.tests
  for select using (auth.role() = 'authenticated');
drop policy if exists "tests_write" on public.tests;
create policy "tests_write" on public.tests
  for all using (public.is_admin()) with check (public.is_admin());

-- TEST QUESTIONS
drop policy if exists "test_questions_read" on public.test_questions;
create policy "test_questions_read" on public.test_questions
  for select using (auth.role() = 'authenticated');
drop policy if exists "test_questions_write" on public.test_questions;
create policy "test_questions_write" on public.test_questions
  for all using (public.is_admin()) with check (public.is_admin());

-- TEST ATTEMPTS (har kim o'zinikini)
drop policy if exists "test_attempts_own" on public.test_attempts;
create policy "test_attempts_own" on public.test_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- TODO ITEMS
drop policy if exists "todo_items_read" on public.todo_items;
create policy "todo_items_read" on public.todo_items
  for select using (auth.role() = 'authenticated');
drop policy if exists "todo_items_write" on public.todo_items;
create policy "todo_items_write" on public.todo_items
  for all using (public.is_admin()) with check (public.is_admin());

-- TODO COMPLETIONS (har kim o'zinikini)
drop policy if exists "todo_completions_own" on public.todo_completions;
create policy "todo_completions_own" on public.todo_completions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ROADMAP
drop policy if exists "roadmap_read" on public.roadmap_stages;
create policy "roadmap_read" on public.roadmap_stages
  for select using (auth.role() = 'authenticated');
drop policy if exists "roadmap_write" on public.roadmap_stages;
create policy "roadmap_write" on public.roadmap_stages
  for all using (public.is_admin()) with check (public.is_admin());

-- =============================================================
--  STORAGE — video va rasm fayllari uchun bucket
-- =============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media_admin_write" on storage.objects;
create policy "media_admin_write" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());
