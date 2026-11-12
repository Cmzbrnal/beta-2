create extension if not exists pgcrypto;

-- Common catalog for content that belongs to a concrete section record.
create table if not exists public.content_entities (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('biblioteca', 'eventos', 'capacitaciones', 'pmo', 'metodologias', 'documentacion')),
  folder text not null default 'General',
  title text not null,
  description text not null default '',
  content jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.content_entities
  drop constraint if exists content_entities_section_check;

alter table public.content_entities
  add constraint content_entities_section_check
  check (section in ('biblioteca', 'eventos', 'capacitaciones', 'pmo', 'metodologias', 'documentacion'));

alter table public.content_entities
  add column if not exists folder text not null default 'General';

create index if not exists content_entities_section_status_idx
  on public.content_entities (section, folder, status);

create table if not exists public.content_folders (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('biblioteca', 'pmo', 'metodologias', 'documentacion')),
  name text not null,
  created_by text not null,
  created_at timestamptz not null default now(),
  unique (section, name, created_by)
);

create index if not exists content_folders_section_idx
  on public.content_folders (section, created_at);

create table if not exists public.content_spaces (
  id uuid primary key default gen_random_uuid(),
  space_key text not null unique,
  section text not null check (section in ('biblioteca', 'eventos', 'capacitaciones', 'pmo', 'metodologias', 'documentacion')),
  title text not null,
  description text not null default '',
  display_order integer not null default 0,
  is_default boolean not null default false,
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_spaces_order_idx
  on public.content_spaces (display_order, created_at);

insert into public.content_spaces (space_key, section, title, description, display_order, is_default, created_by)
values
  ('biblioteca', 'biblioteca', 'Biblioteca de Recursos', 'Templates, guías y documentos esenciales para gestión de proyectos.', 1, true, 'system'),
  ('metodologias', 'metodologias', 'Metodologías Ágiles', 'Scrum, Kanban, SAFe y más para proyectos de transformación.', 2, true, 'system'),
  ('riesgos', 'documentacion', 'Gestión de Riesgos', 'Matrices, planes de contingencia y registro de issues.', 3, true, 'system'),
  ('kpis', 'documentacion', 'KPIs & Métricas', 'Dashboards y OKRs para medir el rendimiento de tus proyectos.', 4, true, 'system'),
  ('pmo', 'pmo', 'PMO Setup', 'Estructura tu oficina de proyectos desde cero.', 5, true, 'system'),
  ('documentacion', 'documentacion', 'Documentación', 'Charters, planes, reportes y plantillas profesionales.', 6, true, 'system')
on conflict (space_key) do nothing;

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

-- Keep older section-specific tables usable when they exist.
do $$
begin
  if to_regclass('public.contenido_borradores') is not null then
    alter table public.contenido_borradores
      add column if not exists entity_id uuid;
    create index if not exists contenido_borradores_entity_idx
      on public.contenido_borradores (seccion, entity_id);
  end if;

  if to_regclass('public.contenido_archivos') is not null then
    alter table public.contenido_archivos
      add column if not exists entity_id uuid;
    create index if not exists contenido_archivos_entity_idx
      on public.contenido_archivos (seccion, entity_id, created_at desc);
  end if;
end $$;

insert into storage.buckets (id, name, public)
values ('contenido-publico', 'contenido-publico', true)
on conflict (id) do update set public = true;
