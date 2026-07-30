# Self-hosted runners

1. Create an enrollment token in Settings (admin).
2. Run the official Playwright container with labels:

```bash
docker run --rm -e LENSQA_ENROLLMENT_TOKEN=... -e LENSQA_API_URL=https://your.app \
  mcr.microsoft.com/playwright:v1.61.0-noble \
  node /app/packages/runner/dist/cli.js run
```

3. Heartbeats update `self_hosted_runners.last_heartbeat`.
4. Set `draining=true` before shutdown to finish in-flight jobs.
5. Kubernetes: Deployment + PVC for browser cache; concurrency via labels.

Version compatibility is checked against `/api/version`.
