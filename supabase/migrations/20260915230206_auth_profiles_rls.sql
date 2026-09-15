-- ============================================================
-- Youga App · Controle de acesso
-- Tabela de perfis + criação automática no signup + RLS
-- (demo de autenticação · mentoria Inceptia)
-- ============================================================

-- 1) Tabela de perfis, ligada 1:1 aos usuários do Supabase Auth.
--    role define quem é usuária (paciente) e quem é médica (admin).
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  full_name  text,
  role       text not null default 'usuaria'
             check (role in ('usuaria', 'medica')),
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Perfil de cada usuário autenticado do Youga App.';

-- 2) Quando um usuário se cadastra em auth.users, cria o perfil dele
--    automaticamente. SECURITY DEFINER para poder escrever em public.profiles.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3) Row Level Security: o coração do controle de acesso.
--    Sem policy que libere, ninguém lê/escreve nada — nem com a anon key.
alter table public.profiles enable row level security;

-- Helper: o usuário logado é médica? (evita recursão de RLS na própria tabela)
create or replace function public.is_medica()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'medica'
  );
$$;

-- Cada usuária enxerga apenas o próprio perfil...
drop policy if exists "perfil: ler o próprio" on public.profiles;
create policy "perfil: ler o próprio"
  on public.profiles for select
  using (auth.uid() = id);

-- ...e a médica (admin) enxerga todos.
drop policy if exists "perfil: médica lê todos" on public.profiles;
create policy "perfil: médica lê todos"
  on public.profiles for select
  using (public.is_medica());

-- Cada usuária atualiza o próprio perfil (nome), sem trocar o próprio role.
drop policy if exists "perfil: atualizar o próprio" on public.profiles;
create policy "perfil: atualizar o próprio"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = 'usuaria');
