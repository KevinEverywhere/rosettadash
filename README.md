# RosettaDash

[![GitHub](https://img.shields.io/badge/GitHub-KevinEverywhere%2Frosettadash-181717?logo=github)](https://github.com/KevinEverywhere/rosettadash)

RosettaDash is a visual dashboard component builder for **developers working locally**. Design dashboard UIs—forms, tables, charts, layouts—assemble them into composites, and export code for your target stack.

## Who this is for

RosettaDash is intended to run on **your machine** during development. There is no required public deployment; GitHub Actions only validates PRs.

## Two ways to use RosettaDash

| Path | When | How |
|------|------|-----|
| **Product (`rosettadash`)** | Contribute, run the visual builder, extend the monorepo | `git clone` this repo → `npm install` → `npm start` |
| **Components (scoped npm)** | Drop typed elements into an existing app | `npm install @rosettadash/<runtime>` → `@rosettadash/<runtime>/<group>/…/<component>` |

Unscoped **rosettadash** is the product (same as clone) — not a component barrel. Library API: [DAS-90](https://planetkevin.atlassian.net/browse/DAS-90); full taxonomy `0.1.0` waits on [DAS-93](https://planetkevin.atlassian.net/browse/DAS-93). Consumer install path: [DAS-99](https://planetkevin.atlassian.net/browse/DAS-99) / [docs/39](docs/39-npm-consumer-install.md).

**Author:** Kevin Ready \<kevin@planetkevin.com\>

```ts
// Consumer API — install scoped packages (not unscoped rosettadash)
import { Accordion } from '@rosettadash/web-components/layout/accordion';
import { Accordion } from '@rosettadash/react/layout/accordion';
import { registerRosettaDashMediaElements } from '@rosettadash/web-components/media';
```

Details: [npm prep](docs/33-npm-package-prep.md) · [Public API](docs/34-public-component-api.md) · [Styling](docs/35-styling-and-classnames.md) · [Post-90 plan](docs/36-npm-post-90-plan.md) · [Consumer install](docs/39-npm-consumer-install.md).

## Monorepo

This repository is an [Nx](https://nx.dev) workspace (free tier, no Nx Cloud required).

| Project | Path | Description |
|---------|------|-------------|
| `client` | `apps/client` | Angular builder UI |
| `server` | `apps/server` | NestJS API |
| `core` | `packages/core` | Shared types and utilities |
| `web-components` | `packages/web-components` | Runtime custom elements (`@rosettadash/web-components`) |
| `ui-primitives` | `packages/ui-primitives` | Preview mock data and generators |
| `exporters-react` | `packages/exporters-react` | React UI code generator from ExportIR |
| `exporters-nest` | `packages/exporters-nest` | NestJS + PostgreSQL server generator from ExportIR |
| `exporters-express` | `packages/exporters-express` | Express + PostgreSQL server generator from ExportIR |
| `exporters-next` | `packages/exporters-next` | Next.js + PostgreSQL server generator from ExportIR |
| `exporters-nuxt` | `packages/exporters-nuxt` | Nuxt + PostgreSQL server generator from ExportIR |
| `exporters-svelte` | `packages/exporters-svelte` | Svelte UI code generator from ExportIR |
| `exporters-mongodb` | `packages/exporters-mongodb` | MongoDB database layer generator from ExportIR |
| `exporters-supabase` | `packages/exporters-supabase` | Supabase database layer generator from ExportIR |
| `exporters-mysql` | `packages/exporters-mysql` | MySQL database layer generator from ExportIR |

## Build your first dashboard

This walkthrough builds a real example dashboard using a built-in starter template — no manual wiring required.

### 1. Start RosettaDash

```bash
npm start
```

Open **http://localhost:4200**.

### 2. Choose a stack

On the welcome page:

1. Expand **Component model** and pick **W3C Web Components** (or React / Angular / Vue / Svelte if you prefer framework-native export).
2. Optionally expand **Server**, **Database**, and **Styling** — for a UI-only demo, leave server and database as **None**.
3. Click **Continue to builder**.

Tip: expand **Documentation → README** on the welcome page to read this guide at runtime.

### 3. Apply a starter template

In the builder toolbar:

1. Open the **Select template…** dropdown.
2. Choose **Analytics overview** (date filter + KPIs + table + line chart) or any **Office / Media / Dev** starter such as **Executive KPI dashboard**.
3. Click **Apply template**.

The canvas loads a complete dashboard composite with bindings already connected.

### 4. Preview with mock data

1. Switch to **Preview** mode in the toolbar.
2. Interact with filters, tables, and charts — mock data comes from the local NestJS API.
3. Add a **Collapsible** layout from the palette (**Layout** group) to wrap sections; exported Web Components include matching `<rd-*>` elements and `{ComponentName}.css` stylesheets.

### 5. Export

1. Click **Export** in the toolbar.
2. Pick your UI target and download the zip.
3. For Web Components exports, each custom element has a sibling CSS file (for example `KpiCard.ts` + `KpiCard.css`) with a root class matching the component export name.

See [Local development & component how-to](docs/13-local-development-and-components.md) for adding your own palette components.

## Run locally

### First-time setup

From the repo root (`rosettadash/`):

```bash
npm install                  # JavaScript dependencies
npm run setup:e2e      # Playwright Chromium (required once for e2e)
npm run e2e:fresh      # use once after setup:e2e if Nx replays an old cached failure
npm run verify:all     # optional sanity check
```

**Important:** If you skip `npm run setup:e2e`, `npm run e2e` / `npm run verify:all` fail with `Executable doesn't exist at .../ms-playwright/...`. Run:

```bash
npx playwright install chromium
```

Full guide: **[docs/13-local-development-and-components.md](docs/13-local-development-and-components.md)** (startup, troubleshooting, adding components).

### Run with Docker (no local Node required)

If you prefer containers, see **[docs/14-docker-containers.md](docs/14-docker-containers.md)**.

```bash
# Dev: hot reload on http://localhost:4200
npm run docker:dev

# App: production-style build on http://localhost:8080
npm run docker:app
```

Requires [Docker](https://docs.docker.com/get-docker/) with Compose v2.

### Start the builder (client + server)

You need **both** processes for save, preview, and export:

```bash
npm start
```

Then open **http://localhost:4200** in your browser.

### Builder guides & AI assist

Once the builder is running:

| Feature | Where | What it does |
|---------|-------|----------------|
| **Builder guides** | Palette **i** icon, canvas placement prompt, **Admin → Builder guides** | Animated, step-by-step instructions for each palette component (bindings, companions, layout). Browse all 44 types under Admin before you build. |
| **AI assist drawer** | Builder toolbar → **AI assist** | Chat with a local **Ollama** model (free) or a BYOK cloud provider. Ask in natural language; review structured actions, then **Apply to canvas**. |
| **Voice input** | AI drawer microphone button | Dictate prompts (Chrome/Edge; enable **Voice** under Admin → AI, voice & environment). |
| **Inspector suggestions** | Inspector → **Suggestions** (when a node is selected) | Rule-based patches from the defaults engine — e.g. bind PostgreSQL to a table. Apply or dismiss each suggestion. |
| **Ask AI (palette)** | *Planned* — use the AI drawer for now | Quick “build this for me” from the palette will land in a follow-up; the drawer already accepts “add a date range filter above my table” style prompts. |

**Enable AI**

1. Open **Settings** (nav bar) or `/environment`.
2. For free local inference: install [Ollama](https://ollama.com), pull a model (e.g. `llama3.2`), confirm **Test connection**.
3. For cloud: enter your provider API key (OpenAI, Anthropic, Google, Azure OpenAI) and pick a model.
4. Under **Admin → AI, voice & environment**, ensure **AI assist** (and optionally **Voice**) are enabled.

Guides work offline with no API key. AI features require Ollama or BYOK — keys stay in your browser, never on the RosettaDash server.

See [Builder creation assistance](docs/21-builder-creation-assistance.md) and [AI & BYOK integration](docs/20-ai-and-byok-integration.md).

| Service | URL | Notes |
|---------|-----|-------|
| Angular client | http://localhost:4200 | Builder UI |
| NestJS API | http://localhost:3000/api | REST backend |
| Health check | http://localhost:3000/api/health | Confirms server is up |

Quick health check:

```bash
curl http://localhost:3000/api/health
```

The Angular dev server proxies `/api/*` to the NestJS server, so the client always calls `/api/...` without CORS setup.

### Run client or server separately

Start the **server first**, then the client:

```bash
npm run start:server   # NestJS only → http://localhost:3000/api
npm run start:client   # Angular only → http://localhost:4200 (needs server for API)
```

### Quality checks (run before committing)

```bash
npm run verify         # lint + typecheck + unit tests
npm run setup:e2e      # re-run if Playwright was upgraded and e2e fails
npm run e2e            # Playwright (starts server + client on :4201/:3001)
npm run verify:all     # both
```

**E2E tips:** Playwright uses dedicated ports **4201** (client) and **3001** (API) so it can run alongside `npm start` on 4200/3000. Install browsers with `npm run setup:e2e` before the first e2e run. See [docs/13-local-development-and-components.md](docs/13-local-development-and-components.md).

## Component examples (Storybook)

RosettaDash ships **five Storybook catalogs** — one per runtime — for interactive component and dashboard examples without opening the builder. See [Storybook component catalog](docs/38-storybook-component-catalog.md) (DAS-98).

| Runtime | Port | Command |
|---------|------|---------|
| Web Components (primary) | 6006 | `npm run storybook:web-components` |
| React | 6007 | `npm run storybook:react` |
| Vue | 6008 | `npm run storybook:vue` |
| Angular | 6009 | `npm run storybook:angular` |
| Svelte | 6010 | `npm run storybook:svelte` |

Run all five in parallel: `npm run storybook:all`. Build static sites: `npm run build-storybook`.

The **web-components** catalog (port **6006**) is the primary entry:

- **Getting Started** — intro and component index with deep links
- **Catalog / Palette** — every builder group with live demos
- **Catalog / Meta compositions** — full dashboard recipes (layout diagram, live preview, component XML, WASM compute lab)

Per-framework catalogs (React, Vue, Angular, Svelte) are documented and runnable on their ports; sidebar alignment with the web-components catalog is tracked in [DAS-112](https://planetkevin.atlassian.net/browse/DAS-112).

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
| POST | `/api/export/angular` | Build ExportIR and generate Angular UI source files |
| POST | `/api/export/vue` | Build ExportIR and generate Vue UI source files |
| POST | `/api/export/svelte` | Build ExportIR and generate Svelte UI source files |
| POST | `/api/export/nest` | Build ExportIR and generate NestJS + PostgreSQL server files |
| POST | `/api/export/express` | Build ExportIR and generate Express + PostgreSQL server files |
| POST | `/api/export/next` | Build ExportIR and generate Next.js + PostgreSQL server files |
| POST | `/api/export/nuxt` | Build ExportIR and generate Nuxt + PostgreSQL server files |
| POST | `/api/export/mongodb` | Build ExportIR and generate MongoDB database layer files |
| POST | `/api/export/supabase` | Build ExportIR and generate Supabase database layer files |
| POST | `/api/export/mysql` | Build ExportIR and generate MySQL database layer files |
| POST | `/api/export/bundle` | Build ExportIR and generate combined UI + server file list (targets from composite `exportTargets`) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run setup:e2e` | Install Playwright Chromium (required once for e2e) |
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

**Developer guides:**

- [Local development & component how-to](docs/13-local-development-and-components.md)
- [Storybook component catalog](docs/38-storybook-component-catalog.md)
- [CI and hosting](docs/12-ci-and-hosting.md)
- [Docker containers (local)](docs/14-docker-containers.md)
- [App component CSS convention](docs/28-app-component-css-convention.md)
- [Builder guides & AI assist](docs/21-builder-creation-assistance.md)

## Workflow

**Gate:** Jira ticket + matching branch **before any work.** See [Workflow & Branching](docs/07-workflow-and-branching.md).

1. **Create Jira ticket** in [DAS](https://planetkevin.atlassian.net/jira/software/projects/DAS/boards/68/backlog) (agents use Jira MCP).
2. **Branch** from `development`: `feature/DAS-<n>-<description>` (must match ticket key).
3. Implement on that branch only.
4. Run `npm run verify` before committing.
5. Kevin commits and merges to `development`.

## Current ticket

**[DAS-111](https://planetkevin.atlassian.net/browse/DAS-111)** — Docs & README sync — current ticket, Storybook examples, backlog refresh  
Branch: `feature/DAS-111-docs-readme-storybook-sync`

**Next:** [DAS-112](https://planetkevin.atlassian.net/browse/DAS-112) — align React, Vue, Angular, and Svelte Storybook sidebars with web-components (DAS-110).

Recently closed: DAS-105–110 (Storybook meta compositions, palette, three-panel XML, getting started, WASM compute lab, sidebar tightening). npm taxonomy [DAS-93](https://planetkevin.atlassian.net/browse/DAS-93) remains the `0.1.0` gate.

## License

MIT
