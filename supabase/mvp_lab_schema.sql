-- MVP LAB isolated tables. Run only in the explicitly selected Supabase project.
create table if not exists public.mvp_lab_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.mvp_lab_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('cash','credit')),
  name text not null,
  price_units numeric not null default 0 check (price_units >= 0),
  sale_meso numeric not null default 0 check (sale_meso >= 0),
  updated_at timestamptz not null default now()
);
create index if not exists mvp_lab_items_user_idx on public.mvp_lab_items(user_id);
alter table public.mvp_lab_profiles enable row level security;
alter table public.mvp_lab_items enable row level security;
revoke all on public.mvp_lab_profiles,public.mvp_lab_items from anon;
grant select,insert,update,delete on public.mvp_lab_profiles,public.mvp_lab_items to authenticated;
create policy "mvp profiles select own" on public.mvp_lab_profiles for select to authenticated using ((select auth.uid())=user_id);
create policy "mvp profiles insert own" on public.mvp_lab_profiles for insert to authenticated with check ((select auth.uid())=user_id);
create policy "mvp profiles update own" on public.mvp_lab_profiles for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "mvp profiles delete own" on public.mvp_lab_profiles for delete to authenticated using ((select auth.uid())=user_id);
create policy "mvp items select own" on public.mvp_lab_items for select to authenticated using ((select auth.uid())=user_id);
create policy "mvp items insert own" on public.mvp_lab_items for insert to authenticated with check ((select auth.uid())=user_id);
create policy "mvp items update own" on public.mvp_lab_items for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "mvp items delete own" on public.mvp_lab_items for delete to authenticated using ((select auth.uid())=user_id);
