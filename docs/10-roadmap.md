# Roadmap

Phased delivery plan for DashBuilder. Tickets will be created in Jira (DAS project) per phase.

## Phase 0 — Foundation

**Tickets:** DAS-1 through DAS-8 (done), [DAS-9](https://planetkevin.atlassian.net/browse/DAS-9) (in progress)

- [x] Vision, architecture, and workflow documentation
- [x] `development` branch as integration target
- [x] Monorepo scaffold (Angular client + NestJS server + packages/core)
- [x] Core model, projects API, builder shell, canvas persistence
- [x] CI verify baseline (`npm run verify` + GitHub Actions)
- [x] Playwright E2E smoke test

See [planned tickets](./11-planned-tickets.md) for Phase 2+ breakdown.

## Phase 1 — Core model & builder shell (complete)

- [x] Component type registry and JSON schemas in `packages/core`
- [x] Composite graph CRUD API (NestJS)
- [x] Angular shell: palette, canvas, inspector
- [x] Project save/load
- [x] Basic validation rules (draft + strict modes)

**Next:** Phase 2 — bindings UI and preview renderers (DAS-9+).

## Phase 2 — Preview & P0 palette

- [x] Bindings UI (connect ports) — DAS-9
- [x] Preview renderers for P0 components — DAS-10
- [x] Mock data generation (NestJS preview module) — DAS-11
- [x] Date range → table/chart data flow in preview — DAS-12

**Phase 2 exit criteria met.**

## Phase 3 — Export MVP

- IR builder from validated graph
- React UI exporter (P0 components)
- NestJS server exporter
- PostgreSQL infra exporter
- Export wizard + zip download
- `.env.example` generation

**Exit criteria:** Exported React + NestJS + PostgreSQL project runs with env vars set.

## Phase 4 — Multi-target export

- Angular and Vue UI exporters
- Next.js, Nuxt, Express server exporters
- **Svelte UI exporter** (fourth UI framework, after Phase 4 server exporters)
- MongoDB, Supabase, MySQL exporters
- Export target matrix testing

**Exit criteria:** Same composite exports to at least 3 UI × 2 server combinations.

## Phase 4b — Extended UI targets

- Svelte UI exporter + export wizard picker update
- Align export IR `ui` target union with Svelte

## Future — 3D visualization (planning)

- **three.js**-based 3D dashboard display components — integration approach TBD (preview renderer vs export target vs both)

## Phase 5 — Smart defaults & domain

- Defaults engine (rule-based suggestions)
- Domain context: client, project, roles
- Role gates and scoped queries in export
- Onboarding composite template

**Exit criteria:** Builder suggests chart type and pagination; exported app respects role visibility.

## Phase 6 — Advanced UX

- Undo/redo
- Composite templates library
- Drag-and-drop layout polish (snap, resize)
- Animation and sortable list components
- Export README with setup instructions per target

## Phase 7 — Production hardening

- Builder authentication
- Project versioning and diff
- E2E tests (Playwright)
- Performance: large composite handling
- Exporter plugin SDK documentation

## Backlog ideas (unscheduled)

- Real-time collaborative editing
- Tailwind token export
- Svelte / Solid exporters
- CLI export (`npx dashbuilder export`)
- Hosted preview URLs
- Custom component SDK for third-party palette plugins

## Ticket creation guidance

When creating Jira tickets:

1. One deliverable per ticket where possible
2. Include acceptance criteria checklist
3. Reference docs sections and branch name in description
4. Label by phase (`phase-1`, `export`, etc.) when Jira labels available

## Related documents

- [Workflow & Branching](./07-workflow-and-branching.md)
- [Technology Stack](./06-technology-stack.md)
- [Component Taxonomy](./08-component-taxonomy.md)
