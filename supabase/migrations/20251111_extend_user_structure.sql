-- Create escolas table if it doesn't exist
create table if not exists public.escolas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  endereco text,
  created_at timestamptz default now()
);

-- Create turmas table if it doesn't exist
create table if not exists public.turmas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ano text,
  escola_id uuid references public.escolas(id) on delete cascade,
  created_at timestamptz default now()
);

-- Extend profiles with new linkage columns (nullable for backwards compatibility)
alter table public.profiles
  add column if not exists deficiencia text check (deficiencia in ('Visual','Auditiva')),
  add column if not exists turma_id uuid references public.turmas(id) on delete set null,
  add column if not exists escola_id uuid references public.escolas(id) on delete set null,
  add column if not exists turno text check (turno in ('manha','tarde','noite'));

-- Enable row level security and basic policies for escolas
alter table public.escolas enable row level security;

drop policy if exists "authenticated read escolas" on public.escolas;
create policy "authenticated read escolas" on public.escolas
for select to authenticated using (true);

drop policy if exists "admins manage escolas" on public.escolas;
create policy "admins manage escolas" on public.escolas
for all to authenticated using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.user_type = 'admin'
  )
) with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.user_type = 'admin'
  )
);

-- Enable row level security and basic policies for turmas
alter table public.turmas enable row level security;

drop policy if exists "authenticated read turmas" on public.turmas;
create policy "authenticated read turmas" on public.turmas
for select to authenticated using (true);

drop policy if exists "admins manage turmas" on public.turmas;
create policy "admins manage turmas" on public.turmas
for all to authenticated using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.user_type = 'admin'
  )
) with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.user_type = 'admin'
  )
);

-- Helpful indexes for lookups
create index if not exists idx_turmas_escola_id on public.turmas(escola_id);
create index if not exists idx_profiles_turma_id on public.profiles(turma_id);
create index if not exists idx_profiles_escola_id on public.profiles(escola_id);

-- Create materias table for teacher-subject management
create table if not exists public.materias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  teacher_id uuid references auth.users(id) on delete set null,
  turma_id uuid references public.turmas(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.materias enable row level security;

drop policy if exists "teachers manage materias" on public.materias;
create policy "teachers manage materias" on public.materias
for all to authenticated using (
  teacher_id = auth.uid()
) with check (
  teacher_id = auth.uid()
);

drop policy if exists "admins manage materias" on public.materias;
create policy "admins manage materias" on public.materias
for all to authenticated using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.user_type = 'admin'
  )
) with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.user_type = 'admin'
  )
);

drop policy if exists "teachers read materias" on public.materias;
create policy "teachers read materias" on public.materias
for select to authenticated using (
  teacher_id = auth.uid()
);

create index if not exists idx_materias_teacher_id on public.materias(teacher_id);
create index if not exists idx_materias_turma_id on public.materias(turma_id);

-- Allow teachers to read profiles of students in their subjects
drop policy if exists "teachers read subject profiles" on public.profiles;
create policy "teachers read subject profiles" on public.profiles
for select to authenticated using (
  exists (
    select 1
    from public.materias m
    where m.turma_id = profiles.turma_id
      and m.teacher_id = auth.uid()
  )
);
