# LensQA architecture

```mermaid
flowchart LR
  developer[Developer] --> gha[GitHubActions]
  gha --> runner[LensQARunner]
  runner --> store[DemoStore]
  runner --> ingest[IngestAPI]
  runner --> storage[PrivateArtifacts]
  ingest --> db[SupabasePostgres]
  reviewer[Reviewer] --> web[NextDashboard]
  web --> db
  web --> storage
```

## Packages
- `apps/web` — Next.js dashboard + marketing
- `apps/demo-store` — deterministic e-commerce fixture
- `packages/runner` — Playwright CLI + visual/quality tests
- `packages/sdk` — typed API client
- `packages/shared` — shared types + confidence/flake helpers
- `extension` — MV3 capture helper
- `supabase` — migrations, seed, local config
