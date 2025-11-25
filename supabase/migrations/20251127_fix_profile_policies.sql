-- Helper function to check if current user is admin without triggering RLS recursion
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and user_type = 'admin'
  );
$$;

comment on function public.is_admin() is 'Returns true when the authenticated user has the admin role.';

grant execute on function public.is_admin() to authenticated;

-- Recreate admin policies using the helper function to avoid recursive lookups
drop policy if exists "admins read profiles" on public.profiles;
create policy "admins read profiles" on public.profiles
for select to authenticated
using (public.is_admin());

drop policy if exists "admins update profiles" on public.profiles;
create policy "admins update profiles" on public.profiles
for update to authenticated
using (public.is_admin())
with check (public.is_admin());


