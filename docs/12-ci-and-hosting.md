# CI and Hosting

## Primary target: local developer machines

DashBuilder is built for **developers running the builder on their own machines**. That is the supported day-to-day workflow:

```bash
npm install
npm run setup:e2e   # Playwright Chromium — once per machine / after @playwright/test upgrade
npm start
# → http://localhost:4200
```

No public server or cloud hosting is required to use the product.

Full startup and component guide: **[Local Development & Components](./13-local-development-and-components.md)**.

## GitHub Actions (CI) — validation only

CI confirms that changes pass lint, typecheck, unit tests, and Playwright e2e. It does **not** deploy a public instance.

| Workflow | File | Runs |
|----------|------|------|
| **verify** | `.github/workflows/verify.yml` | `npm run verify` |
| **e2e** | same file, separate job | `npm run e2e` |

Triggers: pull requests and pushes to `development`.

CI uses **Node 22** with **npm 11** (`npm install -g npm@11.17.0` in the workflow; see `packageManager` in `package.json`). The lockfile is generated with npm 11 — Node 22’s bundled npm 10 rejects it. Corepack activation in a separate workflow step did not persist to later steps on GitHub Actions.

## Nx — yes, free tier

- Nx orchestrates builds, tests, and e2e locally and in CI via npm scripts.
- **Nx Cloud is not used.**

## GitHub Pages — no

Pages hosts static files only. The builder needs NestJS for save/load and preview mock data.

## Run locally

From the repository root:

```bash
npm install
npm run setup:e2e    # if you plan to run e2e locally
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
npm run setup:e2e    # if browsers missing
npm run e2e            # or npm run verify:all
```

### E2E troubleshooting (local)

| Symptom | Fix |
|---------|-----|
| `Executable doesn't exist at .../ms-playwright/...` after running `setup:e2e` | Nx may be replaying a **cached failed e2e run** from before browsers were installed. Run `npm run e2e:fresh` once, or `npx nx reset` then `npm run e2e`. E2e caching is disabled in `apps/client-e2e/project.json` going forward. |
| `Executable doesn't exist at .../ms-playwright/...` (first time) | Run `npm run setup:e2e` or `npx playwright install chromium` |
| All e2e tests timeout on "Loading project…" | E2E uses ports **4201** / **3001** (not 4200/3000). Cancel stuck `verify:all` or `nx e2e` runs and re-run `npm run e2e`. |
| E2e waits forever on "another nx process" | Cancel stuck `nx serve` / `verify:all` runs; re-run `npm run e2e`. |
| Preview test fails on "Data source: API" | Server must include `POST /api/preview/data` (DAS-11+). Re-run e2e so Playwright starts fresh servers. |

Playwright config (`apps/client-e2e/playwright.config.ts`):

- Starts NestJS on **:3001** and Angular on **:4201** via `webServer` (health URL checks)
- Does **not** reuse existing dev servers (avoids stale or mismatched `npm start` processes)
- Runs **one worker** (shared in-memory API)

Nx e2e depends on **build only**, not `serve`, to avoid double-starting servers.

## Run on GitHub

Push a branch and open a PR to `development`. Actions runs verify + e2e automatically. No deployment step.

## Related

- [README](../README.md)
- [Local Development & Components](./13-local-development-and-components.md)
- [Workflow & Branching](./07-workflow-and-branching.md)
