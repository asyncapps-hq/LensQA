# Threat model (portfolio)

| Threat | Mitigation |
|---|---|
| Tenant ID tampering | RLS + org membership checks |
| Artifact path traversal | org_id folder prefix + storage policies |
| SSRF via crawl | same-origin only + max pages |
| Token leakage | hashed at rest, shown once |
| Webhook replay | HMAC + timestamp window (wire when live) |
| Public link guessing | unguessable token hash + expiry + revoke |
| Malicious SVG/HTML artifacts | content-type allowlist + private bucket |
| Invite abuse | hashed invite tokens + expiry |

Runnable checks live in `apps/web/lib/signing.test.ts` and runner unit tests.
