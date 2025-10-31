-- Enable required extensions
create extension if not exists pgcrypto;

-- Profiles linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  user_type text check (user_type in ('student','teacher','admin')),
  created_at timestamptz default now()
);

-- Contents (materials)
create table if not exists public.contents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

-- Classes (turmas)
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  teacher_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

-- Enrollments (aluno em turma)
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (class_id, student_id)
);

-- Activities (tarefas)
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  created_at timestamptz default now()
);

-- Messages (comunicação aluno-professor)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.contents enable row level security;
alter table public.classes enable row level security;
alter table public.enrollments enable row level security;
alter table public.activities enable row level security;
alter table public.messages enable row level security;

-- Policies
-- profiles: users can read their own profile; admins can read all (adjust as needed)
create policy if not exists "read own profile" on public.profiles
for select to authenticated using (auth.uid() = id);

create policy if not exists "update own profile" on public.profiles
for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- contents: everyone authenticated can read; only teacher/admin can insert/update (simplified: owner)
create policy if not exists "read contents" on public.contents
for select to authenticated using (true);

create policy if not exists "manage own contents" on public.contents
for all to authenticated using (created_by = auth.uid()) with check (created_by = auth.uid());

-- classes: teacher owner can manage; students can read if enrolled
create policy if not exists "teachers read own classes" on public.classes
for select to authenticated using (teacher_id = auth.uid());

create policy if not exists "teachers manage own classes" on public.classes
for all to authenticated using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

-- enrollments: students/teachers can read if related
create policy if not exists "read related enrollments" on public.enrollments
for select to authenticated using (
  student_id = auth.uid() or exists (
    select 1 from public.classes c where c.id = enrollments.class_id and c.teacher_id = auth.uid()
  )
);

-- activities: students in class can read; teacher can manage
create policy if not exists "read activities in my classes" on public.activities
for select to authenticated using (
  exists (
    select 1 from public.classes c
    left join public.enrollments e on e.class_id = c.id
    where c.id = activities.class_id and (c.teacher_id = auth.uid() or e.student_id = auth.uid())
  )
);

create policy if not exists "teachers manage activities" on public.activities
for all to authenticated using (
  exists (select 1 from public.classes c where c.id = activities.class_id and c.teacher_id = auth.uid())
) with check (
  exists (select 1 from public.classes c where c.id = activities.class_id and c.teacher_id = auth.uid())
);

-- messages: sender or recipient
create policy if not exists "read own thread" on public.messages
for select to authenticated using (sender_id = auth.uid() or recipient_id = auth.uid());

create policy if not exists "send message" on public.messages
for insert to authenticated with check (sender_id = auth.uid());

-- Optional seeds (remove in prod)
-- insert into public.profiles (id, name, user_type) values (auth.uid(), 'Usuário', 'student') on conflict (id) do nothing;

