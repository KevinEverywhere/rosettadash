# CI and Hosting

## Primary target: local developer machines

DashBuilder is built for **developers running the builder on their own machines**. That is the supported day-to-day workflow:

```bash
npm install
npm start
# → http://localhost:4200
```

No public server or cloud hosting is required to use the product.

## GitHub Actions (CI) — validation only

CI confirms that changes pass lint, typecheck, unit tests, and Playwright e2e. It does **not** deploy a public instance.

| Workflow | File | Runs |
|----------|------|------|
| **verify** | `.github/workflows/verify.yml` | `npm run verify` |
| **e2e** | same file, separate job | `npm run e2e` |

Triggers: pull requests and pushes to `development`.

## Nx — yes, free tier

- Nx orchestrates builds, tests, and e2e locally and in CI via npm scripts.
- **Nx Cloud is not used.**

## GitHub Pages — no

Pages hosts static files only. The builder needs NestJS for save/load and preview mock data.

## Run locally

From the repository root:

```bash
npm install
npm start
```

| What | URL |
|------|-----|
| Builder UI | http://localhost:4200 |
| API | http://localhost:3000/api |
| Health | http://localhost:3000/api/health |

Use **Design** mode to edit the canvas; **Preview** mode renders P0 components using `POST /api/preview/data`.

### Separate processes

```bash
npm run start:server   # :3000
npm run start:client   # :4200 (proxies /api → server)
```

### Before you commit

```bash
npm run verify
npm run e2e            # or npm run verify:all
```

### E2E troubleshooting (local)

| Symptom | Fix |
|---------|-----|
| All e2e tests timeout on "Loading project…" | Ensure API is up: `curl http://localhost:3000/api/health`. Stop stale processes on `:3000` / `:4200`. |
| E2e waits forever on "another nx process" | Cancel stuck `nx serve` / `verify:all` runs; re-run `npm run e2e`. |
| Preview test fails on "Data source: API" | Server must include `POST /api/preview/data` (DAS-11+). Restart dev servers after pulling. |

Playwright config (`apps/client-e2e/playwright.config.ts`):

- Starts NestJS + Angular via `webServer` (with health URL checks)
- Reuses existing local servers when not in CI
- Runs **one worker** (shared in-memory API)

Nx e2e depends on **build only**, not `serve`, to avoid double-starting servers.

## Run on GitHub

Push a branch and open a PR to `development`. Actions runs verify + e2e automatically. No deployment step.

## Related

- [README](../README.md)
- [Workflow & Branching](./07-workflow-and-branching.md)
