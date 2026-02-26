-- 1. TABELA DE PERFIS
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  xp integer default 0,
  streak integer default 0,
  level integer default 1,
  last_active date,
  created_at timestamp with time zone default now()
);

-- 2. TABELA DE PROGRESSO
create table if not exists progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  module_id text not null,
  completed boolean default false,
  score integer default 0,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  unique(user_id, module_id)
);

-- 3. FUNÇÃO PARA ADICIONAR XP E SUBIR DE NÍVEL
create or replace function add_xp(user_id uuid, xp_amount integer)
returns void as $$
declare
  current_xp integer;
  new_xp integer;
  new_level integer;
begin
  select xp into current_xp from profiles where id = user_id;
  new_xp := current_xp + xp_amount;
  new_level := floor(new_xp / 250) + 1;
  if new_level > 4 then new_level := 4; end if;
  update profiles set xp = new_xp, level = new_level where id = user_id;
end;
$$ language plpgsql security definer;

-- 4. POLÍTICAS DE SEGURANÇA (RLS)
alter table profiles enable row level security;
alter table progress enable row level security;

-- Cada utilizador só vê e edita os seus próprios dados
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

create policy "Users can view own progress" on progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on progress for update using (auth.uid() = user_id);
