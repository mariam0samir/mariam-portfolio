-- ============================================================
--  Mariam Samir — Portfolio database (Supabase)
--  شغّلي الملف ده مرة واحدة من SQL Editor
-- ============================================================

-- 1) الأدمن: الإيميل اللي هيدخل لوحة التحكم
create table if not exists public.admin_users (
  email text primary key
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admin_users a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- 2) البيانات الشخصية (صف واحد بس)
create table if not exists public.profile (
  id int primary key default 1 check (id = 1),
  full_name text not null default 'Mariam Samir',
  title text,
  bio text,
  location text,
  email text,
  phone text,
  whatsapp text,
  linkedin text,
  github text,
  cv_url text,
  avatar_url text,
  available boolean not null default true,
  updated_at timestamptz not null default now()
);

-- 3) المهارات
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Frontend',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 4) المشاريع
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  description text,
  image_url text,
  tech text[] not null default '{}',
  role text,
  year int,
  live_url text,
  repo_url text,
  featured boolean not null default false,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 5) الخبرات
create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null,
  location text,
  start_label text,          -- مثال: Jan 2025
  end_label text,            -- سيبيه فاضي لو لسه شغالة هناك
  description text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 6) رسايل فورم التواصل
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  body text not null check (char_length(body) between 1 and 4000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
--  الصلاحيات (RLS)
-- ============================================================
alter table public.admin_users enable row level security;
alter table public.profile     enable row level security;
alter table public.skills      enable row level security;
alter table public.projects    enable row level security;
alter table public.experience  enable row level security;
alter table public.messages    enable row level security;

drop policy if exists "admin reads admins" on public.admin_users;
create policy "admin reads admins" on public.admin_users for select using (public.is_admin());

-- الزوار يقروا المحتوى الظاهر بس — الأدمن يعمل كل حاجة
drop policy if exists "public read profile" on public.profile;
create policy "public read profile" on public.profile for select using (true);
drop policy if exists "admin write profile" on public.profile;
create policy "admin write profile" on public.profile for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read skills" on public.skills;
create policy "public read skills" on public.skills for select using (active or public.is_admin());
drop policy if exists "admin write skills" on public.skills;
create policy "admin write skills" on public.skills for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read projects" on public.projects;
create policy "public read projects" on public.projects for select using (active or public.is_admin());
drop policy if exists "admin write projects" on public.projects;
create policy "admin write projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read experience" on public.experience;
create policy "public read experience" on public.experience for select using (active or public.is_admin());
drop policy if exists "admin write experience" on public.experience;
create policy "admin write experience" on public.experience for all using (public.is_admin()) with check (public.is_admin());

-- الرسايل: أي زائر يقدر يبعت بس، والأدمن بس اللي يقرا ويمسح
drop policy if exists "anyone can send" on public.messages;
create policy "anyone can send" on public.messages for insert with check (is_read = false);
drop policy if exists "admin reads messages" on public.messages;
create policy "admin reads messages" on public.messages for select using (public.is_admin());
drop policy if exists "admin updates messages" on public.messages;
create policy "admin updates messages" on public.messages for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin deletes messages" on public.messages;
create policy "admin deletes messages" on public.messages for delete using (public.is_admin());

-- ============================================================
--  مكان الصور والـ CV
-- ============================================================
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

drop policy if exists "public read portfolio files" on storage.objects;
create policy "public read portfolio files" on storage.objects for select using (bucket_id = 'portfolio');
drop policy if exists "admin upload portfolio files" on storage.objects;
create policy "admin upload portfolio files" on storage.objects for insert with check (bucket_id = 'portfolio' and public.is_admin());
drop policy if exists "admin update portfolio files" on storage.objects;
create policy "admin update portfolio files" on storage.objects for update using (bucket_id = 'portfolio' and public.is_admin());
drop policy if exists "admin delete portfolio files" on storage.objects;
create policy "admin delete portfolio files" on storage.objects for delete using (bucket_id = 'portfolio' and public.is_admin());

-- ============================================================
--  بيانات البداية — كلها تتعدل من لوحة التحكم بعد كده
-- ============================================================
insert into public.profile (id, full_name, title, bio, location, available)
values (1, 'Mariam Samir', 'Front-End Developer',
        'I build bilingual websites and the dashboards behind them — so clients can run their own content without calling a developer.',
        'Cairo, Egypt', true)
on conflict (id) do nothing;

insert into public.skills (name, category, sort_order)
select v.* from (values
  ('React', 'Frontend Development', 1), ('JavaScript', 'Frontend Development', 2), ('HTML', 'Frontend Development', 3), ('CSS', 'Frontend Development', 4),
  ('Tailwind CSS', 'Frontend Development', 5), ('React Router', 'Frontend Development', 6), ('i18next (AR / EN)', 'Frontend Development', 7), ('RTL layouts', 'Frontend Development', 8),
  ('Supabase', 'Backend & Data', 1), ('PostgreSQL', 'Backend & Data', 2), ('Row Level Security', 'Backend & Data', 3), ('Storage & Auth', 'Backend & Data', 4),
  ('Vite', 'Tools', 1), ('Git & GitHub', 'Tools', 2), ('Vercel', 'Tools', 3), ('VS Code', 'Tools', 4)
) as v(name, category, sort_order)
where not exists (select 1 from public.skills);

insert into public.projects (title, summary, description, tech, role, year, live_url, featured, sort_order)
select 'Novida Investment & Technology',
       'Corporate website + full admin dashboard for a listed investment company.',
       'A bilingual (Arabic / English) corporate site where the client''s team manages sectors, projects, news, board members and a complete investor-relations archive — financial statements, disclosures and general-assembly documents from 2013 to today — without touching code.',
       array['React', 'Vite', 'Tailwind CSS', 'Supabase', 'i18next', 'Vercel'],
       'Front-end & dashboard', 2026, 'https://novida.vercel.app', true, 1
where not exists (select 1 from public.projects);

-- ============================================================
--  آخر خطوة: حطي إيميلك هنا (نفس الإيميل اللي هتعمليه User في Authentication)
-- ============================================================
-- insert into public.admin_users (email) values (lower(trim('YOUR-EMAIL@example.com')));


-- ============================================================
--  v2: About + Education + نسب المهارات + الأرقام
-- ============================================================
alter table public.profile add column if not exists about_title text;
alter table public.profile add column if not exists about_text text;
alter table public.profile add column if not exists about_photo_url text;
alter table public.profile add column if not exists stat_projects int;
alter table public.profile add column if not exists stat_years int;
alter table public.profile add column if not exists stat_extra_value text;
alter table public.profile add column if not exists stat_extra_label text;

alter table public.skills add column if not exists level int check (level between 0 and 100);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  institution text,
  tags text[] not null default '{}',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.education enable row level security;
drop policy if exists "public read education" on public.education;
create policy "public read education" on public.education for select using (active or public.is_admin());
drop policy if exists "admin write education" on public.education;
create policy "admin write education" on public.education for all using (public.is_admin()) with check (public.is_admin());

update public.profile set
  about_title = coalesce(about_title, 'I''m Mariam, a front-end developer who turns client needs into websites they can run on their own.'),
  stat_extra_value = coalesce(stat_extra_value, '100%'),
  stat_extra_label = coalesce(stat_extra_label, 'Dedication')
where id = 1;
