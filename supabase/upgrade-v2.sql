-- ============================================================
--  Upgrade v2 — التصميم الجديد (About + Education + نسب المهارات + الأرقام)
--  شغّليه مرة واحدة بعد schema.sql (لو شغلتي schema.sql الجديد مش محتاجاه — بس تشغيله تاني آمن)
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
