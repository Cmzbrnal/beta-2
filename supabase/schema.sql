create extension if not exists pgcrypto;

create table if not exists public.content_entries (
  id uuid primary key default gen_random_uuid(),
  member_code text not null,
  project text not null,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (member_code, project)
);

create table if not exists public.content_files (
  id uuid primary key default gen_random_uuid(),
  member_code text not null,
  project text not null,
  name text not null,
  mime_type text not null,
  storage_path text not null unique,
  public_url text not null,
  created_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public)
values ('cipro-content', 'cipro-content', true)
on conflict (id) do update set public = true;

alter table public.content_entries enable row level security;
alter table public.content_files enable row level security;

revoke all on public.content_entries from anon, authenticated;
revoke all on public.content_files from anon, authenticated;
