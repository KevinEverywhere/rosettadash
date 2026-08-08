# DashBuilder

DashBuilder is a visual dashboard component builder for **developers working locally**. Design dashboard UIs—forms, tables, charts, layouts—assemble them into composites, and export code for your target stack.

## Who this is for

DashBuilder is intended to run on **your machine** during development. There is no required public deployment; GitHub Actions only validates PRs.

## Monorepo

This repository is an [Nx](https://nx.dev) workspace (free tier, no Nx Cloud required).

| Project | Path | Description |
|---------|------|-------------|
| `client` | `apps/client` | Angular builder UI |
| `server` | `apps/server` | NestJS API |
| `core` | `packages/core` | Shared types and utilities |
| `ui-primitives` | `packages/ui-primitives` | Preview mock data and generators |
| `exporters-react` | `packages/exporters-react` | React UI code generator from ExportIR |
| `exporters-nest` | `packages/exporters-nest` | NestJS + PostgreSQL server generator from ExportIR |

## Run locally

From the repo root (`dashbuilder/`):

```bash
# 1. Install dependencies (first time, or after package.json changes)
npm install

# 2. Start the builder (Angular + NestJS together)
npm start
```

Then open **http://localhost:4200** in your browser.

| Service | URL | Notes |
|---------|-----|-------|
| Angular client | http://localhost:4200 | Builder UI |
| NestJS API | http://localhost:3000/api | REST backend |
| Health check | http://localhost:3000/api/health | Confirms server is up |

The Angular dev server proxies `/api/*` to the NestJS server, so the client always calls `/api/...` without CORS setup.

### Run client or server separately

```bash
npm run start:server   # NestJS only → http://localhost:3000/api
npm run start:client   # Angular only → http://localhost:4200 (needs server for save/preview API)
```

### Quality checks (run before committing)

```bash
npm run verify         # lint + typecheck + unit tests
npm run e2e            # Playwright (starts server + client if needed)
npm run verify:all     # both
```

**E2E tips:** Playwright uses dedicated ports **4201** (client) and **3001** (API) so it can run alongside `npm start` on 4200/3000. If tests still hang, cancel stuck `nx serve` / `verify:all` runs and re-run `npm run e2e`.

## CI on GitHub (optional)

CI validates PRs to `development`; no public deployment is required for local development.

Workflow: [`.github/workflows/verify.yml`](.github/workflows/verify.yml) — `verify` + `e2e` on push/PR.

See [docs/12-ci-and-hosting.md](docs/12-ci-and-hosting.md) for troubleshooting.

## API (in-memory MVP)

### Projects & composites

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create project `{ "name": "..." }` |
| GET | `/api/projects/:id` | Get project with composites |
| PATCH | `/api/projects/:id` | Update project metadata |
| DELETE | `/api/projects/:id` | Delete project |
| GET | `/api/projects/:id/composites` | List composites |
| POST | `/api/projects/:id/composites` | Create composite (validated) |
| PUT | `/api/projects/:id/composites/:cid` | Update composite (validated, version++) |
| DELETE | `/api/projects/:id/composites/:cid` | Delete composite |

Invalid composites return `400` with `{ message, issues }`.

### Preview mock data

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/preview/data` | Generate seeded mock rows/chart/KPI fixtures for builder preview |

Example body:

```json
{
  "projectName": "Revenue Ops",
  "compositeName": "Overview",
  "dateRangePreset": "last-7-days",
  "limit": 5
}
```

### Export

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/export/ir` | Build ExportIR from a strictly validated composite (400 on validation errors) |
| POST | `/api/export/react` | Build ExportIR and generate React UI source files |
| POST | `/api/export/nest` | Build ExportIR and generate NestJS + PostgreSQL server files |

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Serve client and server |
| `npm run build` | Build client, server, and core |
| `npm run verify` | **Lint + typecheck + unit tests** (run before every commit) |
| `npm run e2e` | Playwright E2E tests |
| `npm run verify:all` | verify + e2e |
| `npm test` | Run unit tests only |
| `npm run lint` | Lint all projects |
| `npm run typecheck` | TypeScript check all projects |

## Documentation

See [docs/README.md](docs/README.md) for the full documentation index.

Detailed CI vs hosting notes: [docs/12-ci-and-hosting.md](docs/12-ci-and-hosting.md)

## Workflow

1. Pick a Jira ticket in [DAS](https://planetkevin.atlassian.net/jira/software/projects/DAS/boards/68/backlog).
2. Branch from `development`: `feature/DAS-<n>-<description>`.
3. Run `npm run verify` before committing.
4. Open PR to `development`. Kevin commits and merges.

## Current ticket

**[DAS-15](https://planetkevin.atlassian.net/browse/DAS-15)** — NestJS + PostgreSQL infra exporter  
Branch: `feature/DAS-15-nest-pg-exporter`

## License

MIT
