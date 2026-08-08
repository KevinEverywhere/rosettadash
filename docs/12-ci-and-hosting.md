# CI and Hosting

## GitHub Actions (CI) — yes

DashBuilder uses **GitHub Actions** for continuous integration, not GitHub Pages.

| Workflow | File | Runs |
|----------|------|------|
| **verify** | `.github/workflows/verify.yml` | `npm run verify` (lint, typecheck, unit tests) |
| **e2e** | same file, separate job | `npm run e2e` (Playwright smoke) |

Triggers: pull requests and pushes to `development`.

## Nx — yes, free tier

- Nx orchestrates builds, tests, and e2e locally and in CI via `nx` / npm scripts.
- **Nx Cloud is not used** — no distributed caching or remote runners.
- CI runs standard `npm ci` + `npm run verify` + `npm run e2e`.

## GitHub Pages — no (for the builder)

**GitHub Pages is not used** for DashBuilder itself because:

- Pages hosts **static files only**.
- The builder requires a **NestJS API** for project/composite save and load.
- A static client on Pages would load, but **Save would fail** without a hosted backend.

Pages may be considered later for:

- Project documentation site
- A read-only marketing/demo page (no persistence)

## Local commands

| Command | Purpose |
|---------|---------|
| `npm run verify` | Lint + typecheck + unit tests (before every commit) |
| `npm run e2e` | Playwright smoke (starts server + client automatically) |
| `npm run verify:all` | verify + e2e |

## E2E architecture

Playwright config (`apps/client-e2e/playwright.config.ts`) starts:

1. NestJS server on `:3000`
2. Angular client on `:4200` (proxies `/api` to server)

Tests use `data-testid` selectors for stability.
