-- ============================================================
-- KnowCode Academy — Supabase schema
-- Run in Supabase Dashboard > SQL Editor (or `supabase db push`)
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- COURSES ----------
create table if not exists public.courses (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  category    text not null default 'coding',   -- coding | design | gaming | other
  summary     text,
  description text,                              -- long body (markdown/plain)
  duration    text,                              -- e.g. "2 Months"
  level       text default 'Foundation',
  price       text,                              -- free text, e.g. "Free" or "₹4999"
  poster_url  text,                              -- uploaded poster image
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------- BLOGS ----------
create table if not exists public.blogs (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  excerpt     text,
  content     text,
  cover_url   text,
  author      text default 'KnowCode Team',
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------- BANNERS (homepage hero / promo) ----------
create table if not exists public.banners (
  id          uuid primary key default gen_random_uuid(),
  title       text,
  subtitle    text,
  image_url   text not null,
  link_url    text,
  sort_order  int not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------- COURSE APPLICATIONS ----------
create table if not exists public.applications (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid references public.courses(id) on delete set null,
  course_title text,
  name        text not null,
  mobile      text not null,                     -- country code, digits only e.g. 919895123456
  address     text,
  gender      text,
  age         int,
  status      text not null default 'new',       -- new | contacted | enrolled | rejected
  notified    boolean not null default false,    -- WhatsApp confirmation sent?
  created_at  timestamptz not null default now()
);

-- ---------- CONTACT MESSAGES ----------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text,
  mobile      text,
  subject     text,
  message     text not null,
  handled     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- Public site: anon can READ published content + INSERT leads.
-- Admin actions run server-side with the SERVICE ROLE key (bypasses RLS).
-- ============================================================
alter table public.courses          enable row level security;
alter table public.blogs            enable row level security;
alter table public.banners          enable row level security;
alter table public.applications     enable row level security;
alter table public.contact_messages enable row level security;

-- Public read of published rows
create policy "courses public read"  on public.courses  for select using (published = true);
create policy "blogs public read"    on public.blogs    for select using (published = true);
create policy "banners public read"  on public.banners  for select using (active = true);

-- Public can submit leads (insert only)
create policy "applications insert" on public.applications     for insert with check (true);
create policy "contacts insert"     on public.contact_messages for insert with check (true);

-- ============================================================
-- Storage buckets for posters / banners / blog covers
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Anyone can read media; uploads happen server-side via service role.
create policy "media public read"
  on storage.objects for select
  using (bucket_id = 'media');
