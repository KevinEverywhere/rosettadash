# Technology Stack

## Builder application

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Client** | Angular 22 (latest stable with broad ecosystem support) | Strong structure for complex builder UI; team direction; CDK for drag-drop |
| **Server** | NestJS | TypeScript parity with client; modular architecture; aligns with export target |
| **Monorepo** | Nx 23 (free tier, no Nx Cloud) | Shared `packages/core` between client and server |
| **Language** | TypeScript (strict) | End-to-end type safety; shared models |

### Angular client libraries (planned)

| Concern | Library direction |
|---------|-------------------|
| Drag and drop | `@angular/cdk/drag-drop` |
| Forms / inspector | Reactive forms + schema-driven renderer |
| Charts (preview) | Chart.js or similar lightweight preview lib |
| HTTP | `HttpClient` to NestJS API |
| Styling | SCSS + CSS variables; design tokens in core |

### NestJS server libraries (planned)

| Concern | Library direction |
|---------|-------------------|
| Validation | `class-validator` + DTOs |
| Persistence | Deferred — single-user MVP uses in-memory/file stub first |
| Export orchestration | Custom job runner; zip via `archiver` |
| Config | `@nestjs/config` |

## Export targets — UI frameworks

| Framework | Generator output | Notes |
|-----------|------------------|-------|
| **React** | TSX + CSS modules | Hooks-based data fetching |
| **Angular** | Standalone components | Signals-friendly patterns |
| **Vue** | SFC (`.vue`) | Composition API |

Future: Svelte, Solid via plugin interface.

## Export targets — server partners

| Partner | Generated patterns |
|---------|-------------------|
| **Next.js** | App Router API routes or Route Handlers |
| **Nuxt** | Server routes / `server/api/` |
| **NestJS** | Modules, controllers, providers |
| **Express** | Router modules, middleware chain |

## Export targets — databases

| Database | Client/driver direction |
|----------|------------------------|
| **MongoDB** | Official driver or Mongoose |
| **PostgreSQL** | Prisma (preferred when no added cost) or `pg` |
| **Supabase** | `@supabase/supabase-js` |
| **MySQL** | Prisma or `mysql2` |

## Shared packages

| Package | Contents |
|---------|----------|
| `packages/core` | Types, IR, validation, component schemas |
| `packages/exporters/*` | Per-target code generators |
| `packages/ui-primitives` | Builder preview renderers |

## Development tooling

| Tool | Purpose |
|------|---------|
| ESLint + Prettier | Lint/format |
| Jest / Vitest | Unit tests |
| Playwright (future) | E2E builder flows |

## Runtime requirements

| Context | Node version |
|---------|--------------|
| Builder server | Node 20 LTS+ |
| Exported projects | Document per target; generally Node 18+ |

## Explicit non-choices (for now)

| Alternative | Why not initially |
|-------------|-------------------|
| Builder in React | Team chose Angular for builder |
| Builder server in Express | NestJS better matches export targets and structure |
| Proprietary runtime for exports | Violates portability goal |
| GraphQL for builder API | REST sufficient for MVP |

## Decision log

| Date | Decision | Ticket |
|------|----------|--------|
| 2026-08-08 | Angular + NestJS for builder runtime | DAS-1 |
| 2026-08-08 | React, Angular, Vue as initial export UI targets | DAS-1 |
| 2026-08-08 | Next, Nuxt, Nest, Express as initial server targets | DAS-1 |
| 2026-08-08 | MongoDB, PostgreSQL, Supabase, MySQL as initial DB targets | DAS-1 |
| 2026-08-08 | Nx free tier for monorepo; repo is source of truth | DAS-2 |
| 2026-08-08 | Single-user MVP; no auth initially | DAS-2 |
| 2026-08-08 | Angular 22; standalone components for export default | DAS-2 |
| 2026-08-08 | Prisma preferred for PG/MySQL export when no added cost | DAS-2 |
| 2026-08-08 | Neutral design tokens (no brand preset) | DAS-2 |
| 2026-08-08 | `development` branch is integration target for PRs | DAS-2 |

Subsequent decisions append here with Jira references.

## Related documents

- [Architecture](./02-architecture.md)
- [Export Pipeline](./04-export-pipeline.md)
- [Roadmap](./10-roadmap.md)
