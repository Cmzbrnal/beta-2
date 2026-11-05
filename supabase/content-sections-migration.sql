create extension if not exists pgcrypto;

-- Common catalog for content that belongs to a concrete section record.
create table if not exists public.content_entities (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('biblioteca', 'eventos', 'capacitaciones')),
  title text not null,
  description text not null default '',
  content jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_entities_section_status_idx
  on public.content_entities (section, status);

create table if not exists public.content_entity_files (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.content_entities(id) on delete cascade,
  member_code text not null,
  name text not null,
  mime_type text not null,
  storage_path text not null unique,
  public_url text not null,
  created_at timestamptz not null default now()
);

create index if not exists content_entity_files_entity_idx
  on public.content_entity_files (entity_id, created_at desc);

-- Keep the existing section-specific tables usable while adding a stable
-- entity relationship for drafts and files created there.
alter table public.contenido_borradores
  add column if not exists entity_id uuid;

alter table public.contenido_archivos
  add column if not exists entity_id uuid;

create index if not exists contenido_borradores_entity_idx
  on public.contenido_borradores (seccion, entity_id);

create index if not exists contenido_archivos_entity_idx
  on public.contenido_archivos (seccion, entity_id, created_at desc);

insert into storage.buckets (id, name, public)
values ('contenido-publico', 'contenido-publico', true)
on conflict (id) do update set public = true;
