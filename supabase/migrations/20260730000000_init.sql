-- LensQA initial schema
create extension if not exists "pgcrypto";

create type public.org_role as enum ('owner', 'admin', 'member', 'viewer');
create type public.run_status as enum ('pending', 'running', 'passed', 'failed', 'approved', 'cancelled');
create type public.review_decision as enum ('accepted', 'rejected', 'intentional', 'pending');

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  timezone text default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  plan text not null default 'free',
  created_at timestamptz not null default now()
);

create table public.organization_members (
  org_id uuid not null references public.organizations on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  role public.org_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations on delete cascade,
  email text not null,
  role public.org_role not null default 'member',
  token_hash text not null,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations on delete cascade,
  name text not null,
  slug text not null,
  default_branch text not null default 'main',
  base_url text,
  created_at timestamptz not null default now(),
  unique (org_id, slug)
);

create table public.environments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects on delete cascade,
  name text not null,
  base_url text not null,
  is_production boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.test_cases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects on delete cascade,
  name text not null,
  url_path text not null,
  tags text[] default '{}',
  created_at timestamptz not null default now()
);

create table public.runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects on delete cascade,
  environment_id uuid references public.environments on delete set null,
  status public.run_status not null default 'pending',
  commit_sha text,
  branch text,
  pr_number int,
  confidence_score numeric,
  started_at timestamptz,
  finished_at timestamptz,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.results (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.runs on delete cascade,
  test_case_id uuid references public.test_cases on delete set null,
  test_name text not null,
  status text not null,
  browser text not null,
  viewport text not null,
  color_scheme text,
  locale text,
  changed_pixel_ratio numeric,
  duration_ms int,
  diff_signature text,
  checks jsonb default '[]'::jsonb,
  quarantined boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.artifacts (
  id uuid primary key default gen_random_uuid(),
  result_id uuid not null references public.results on delete cascade,
  kind text not null,
  storage_path text not null,
  content_type text not null,
  checksum text,
  bytes bigint,
  created_at timestamptz not null default now()
);

create table public.baselines (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects on delete cascade,
  test_name text not null,
  browser text not null,
  viewport text not null,
  theme text not null default 'light',
  locale text not null default 'en-US',
  branch text not null default 'main',
  artifact_path text not null,
  approved_by uuid references public.profiles,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  unique (project_id, test_name, browser, viewport, theme, locale, branch)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  result_id uuid not null references public.results on delete cascade,
  reviewer_id uuid references public.profiles,
  decision public.review_decision not null default 'pending',
  note text,
  created_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  result_id uuid not null references public.results on delete cascade,
  author_id uuid references public.profiles,
  parent_id uuid references public.comments on delete cascade,
  body text not null,
  region jsonb,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.api_tokens (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects on delete cascade,
  name text not null,
  token_hash text not null unique,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_by uuid references public.profiles,
  created_at timestamptz not null default now()
);

create table public.webhooks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations on delete cascade,
  url text not null,
  secret_hash text not null,
  events text[] not null default '{run.completed}',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations on delete cascade,
  actor_id uuid references public.profiles,
  action text not null,
  target_type text,
  target_id text,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.share_links (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.runs on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_by uuid references public.profiles,
  created_at timestamptz not null default now()
);

create table public.schedules (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects on delete cascade,
  cron text not null,
  timezone text not null default 'UTC',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations on delete cascade,
  key text not null,
  enabled boolean not null default false,
  meta jsonb default '{}'::jsonb,
  unique (org_id, key)
);

create table public.usage_meters (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations on delete cascade,
  period_start date not null,
  screenshots int not null default 0,
  storage_bytes bigint not null default 0,
  seats int not null default 0,
  unique (org_id, period_start)
);

create table public.self_hosted_runners (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations on delete cascade,
  name text not null,
  labels text[] default '{}',
  last_heartbeat timestamptz,
  draining boolean not null default false,
  version text,
  created_at timestamptz not null default now()
);

create table public.github_installations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations on delete cascade,
  installation_id bigint not null unique,
  account_login text,
  suspended boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.known_issues (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects on delete cascade,
  title text not null,
  fingerprint text,
  muted_until timestamptz,
  created_at timestamptz not null default now()
);

create table public.saved_filters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  project_id uuid references public.projects on delete cascade,
  name text not null,
  query jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.activity_feed (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations on delete cascade,
  actor_id uuid references public.profiles,
  summary text not null,
  link text,
  created_at timestamptz not null default now()
);

create index runs_project_created_idx on public.runs (project_id, created_at desc);
create index results_run_idx on public.results (run_id);
create index artifacts_result_idx on public.artifacts (result_id);
create index audit_org_created_idx on public.audit_events (org_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.is_org_member(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members m
    where m.org_id = target_org and m.user_id = auth.uid()
  );
$$;

create or replace function public.org_role(target_org uuid)
returns public.org_role
language sql
stable
security definer
set search_path = public
as $$
  select m.role from public.organization_members m
  where m.org_id = target_org and m.user_id = auth.uid()
  limit 1;
$$;

create or replace function public.can_write_org(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.org_role(target_org) in ('owner', 'admin', 'member'), false);
$$;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.invitations enable row level security;
alter table public.projects enable row level security;
alter table public.environments enable row level security;
alter table public.test_cases enable row level security;
alter table public.runs enable row level security;
alter table public.results enable row level security;
alter table public.artifacts enable row level security;
alter table public.baselines enable row level security;
alter table public.reviews enable row level security;
alter table public.comments enable row level security;
alter table public.api_tokens enable row level security;
alter table public.webhooks enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_events enable row level security;
alter table public.share_links enable row level security;
alter table public.schedules enable row level security;
alter table public.feature_flags enable row level security;
alter table public.usage_meters enable row level security;
alter table public.self_hosted_runners enable row level security;
alter table public.github_installations enable row level security;
alter table public.known_issues enable row level security;
alter table public.saved_filters enable row level security;
alter table public.activity_feed enable row level security;

create policy "profiles self" on public.profiles for select using (auth.uid() = id);
create policy "profiles update self" on public.profiles for update using (auth.uid() = id);

create policy "orgs member read" on public.organizations for select using (public.is_org_member(id));
create policy "orgs admin update" on public.organizations for update using (public.org_role(id) in ('owner', 'admin'));

create policy "members read" on public.organization_members for select using (public.is_org_member(org_id));
create policy "members admin write" on public.organization_members for all using (public.org_role(org_id) in ('owner', 'admin'));

create policy "projects read" on public.projects for select using (public.is_org_member(org_id));
create policy "projects write" on public.projects for all using (public.can_write_org(org_id));

create policy "envs read" on public.environments for select using (
  exists (select 1 from public.projects p where p.id = project_id and public.is_org_member(p.org_id))
);
create policy "envs write" on public.environments for all using (
  exists (select 1 from public.projects p where p.id = project_id and public.can_write_org(p.org_id))
);

create policy "runs read" on public.runs for select using (
  exists (select 1 from public.projects p where p.id = project_id and public.is_org_member(p.org_id))
);
create policy "runs write" on public.runs for all using (
  exists (select 1 from public.projects p where p.id = project_id and public.can_write_org(p.org_id))
);

create policy "results read" on public.results for select using (
  exists (
    select 1 from public.runs r
    join public.projects p on p.id = r.project_id
    where r.id = run_id and public.is_org_member(p.org_id)
  )
);
create policy "results write" on public.results for all using (
  exists (
    select 1 from public.runs r
    join public.projects p on p.id = r.project_id
    where r.id = run_id and public.can_write_org(p.org_id)
  )
);

create policy "artifacts read" on public.artifacts for select using (
  exists (
    select 1 from public.results res
    join public.runs r on r.id = res.run_id
    join public.projects p on p.id = r.project_id
    where res.id = result_id and public.is_org_member(p.org_id)
  )
);

create policy "notifications self" on public.notifications for select using (auth.uid() = user_id);
create policy "notifications update self" on public.notifications for update using (auth.uid() = user_id);

create policy "audit read" on public.audit_events for select using (org_id is not null and public.is_org_member(org_id));
create policy "activity read" on public.activity_feed for select using (public.is_org_member(org_id));
create policy "tokens read" on public.api_tokens for select using (
  exists (select 1 from public.projects p where p.id = project_id and public.is_org_member(p.org_id))
);
create policy "tokens write" on public.api_tokens for all using (
  exists (select 1 from public.projects p where p.id = project_id and public.org_role(p.org_id) in ('owner', 'admin'))
);

insert into storage.buckets (id, name, public) values ('artifacts', 'artifacts', false)
on conflict (id) do nothing;

create policy "artifact objects member read" on storage.objects
  for select using (
    bucket_id = 'artifacts'
    and public.is_org_member((storage.foldername(name))[1]::uuid)
  );

create policy "artifact objects member write" on storage.objects
  for insert with check (
    bucket_id = 'artifacts'
    and public.can_write_org((storage.foldername(name))[1]::uuid)
  );
