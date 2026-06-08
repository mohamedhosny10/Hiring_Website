-- Run this in Supabase SQL Editor or via supabase db push

create table if not exists positions (
  id serial primary key,
  title text not null unique
);

insert into positions (title) values
  ('Frontend Developer'),
  ('Backend Developer'),
  ('UI/UX Designer'),
  ('QA Engineer'),
  ('Project Manager')
on conflict (title) do nothing;

create table if not exists applicants (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  position text not null,
  status text not null default 'Pending',
  notes text,
  created_at timestamptz not null default now()
);

alter table applicants enable row level security;

create policy "Allow public read applicants"
  on applicants for select
  using (true);

create policy "Allow public insert applicants"
  on applicants for insert
  with check (true);

create policy "Allow public update applicants"
  on applicants for update
  using (true);

alter table positions enable row level security;

create policy "Allow public read positions"
  on positions for select
  using (true);
