-- Demo seed (requires a user; safe no-op helpers for local reset)
insert into public.organizations (id, name, slug, plan)
values ('11111111-1111-1111-1111-111111111111', 'Lumen Labs', 'lumen-labs', 'pro')
on conflict (slug) do nothing;

insert into public.projects (id, org_id, name, slug, base_url)
values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'demo-store',
  'demo-store',
  'http://127.0.0.1:4173'
)
on conflict do nothing;

insert into public.environments (id, project_id, name, base_url, is_production)
values (
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  'local',
  'http://127.0.0.1:4173',
  false
)
on conflict do nothing;

insert into public.runs (id, project_id, environment_id, status, commit_sha, branch, confidence_score, started_at, finished_at)
values
(
  '44444444-4444-4444-4444-444444444441',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  'passed',
  'abc1111',
  'main',
  98,
  now() - interval '2 hours',
  now() - interval '2 hours' + interval '3 minutes'
),
(
  '44444444-4444-4444-4444-444444444442',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  'failed',
  'def2222',
  'fix/checkout-css',
  62,
  now() - interval '20 minutes',
  now() - interval '17 minutes'
)
on conflict do nothing;

insert into public.results (id, run_id, test_name, status, browser, viewport, changed_pixel_ratio, duration_ms, checks, diff_signature)
values
(
  '55555555-5555-5555-5555-555555555551',
  '44444444-4444-4444-4444-444444444441',
  'cart',
  'passed',
  'chromium',
  'desktop',
  0,
  1200,
  '[]'::jsonb,
  null
),
(
  '55555555-5555-5555-5555-555555555552',
  '44444444-4444-4444-4444-444444444442',
  'cart',
  'failed',
  'chromium',
  'mobile',
  0.084,
  1400,
  '[{"kind":"visual","severity":"error","code":"DIFF","message":"Mobile checkout button shifted off-screen"}]'::jsonb,
  'visual:cart:mobile:checkout-shift'
)
on conflict do nothing;
