# Roadmap

Phased delivery plan for DashBuilder. Tickets will be created in Jira (DAS project) per phase.

## Phase 0 — Foundation

**Tickets:** [DAS-1](https://planetkevin.atlassian.net/browse/DAS-1) (done), [DAS-2](https://planetkevin.atlassian.net/browse/DAS-2) (in progress)

- [x] Vision, architecture, and workflow documentation
- [x] `development` branch as integration target
- [ ] Monorepo scaffold (Angular client + NestJS server + packages/core)
- [ ] CI lint/test baseline

**Next after DAS-2:** Phase 1 — core model and builder shell

## Phase 1 — Core model & builder shell

- Component type registry and JSON schemas in `packages/core`
- Composite graph CRUD API (NestJS)
- Angular shell: palette (static list), empty canvas, inspector stub
- Project save/load
- Basic validation rules

**Exit criteria:** User can place nodes on canvas, edit properties, save project.

## Phase 2 — Preview & P0 palette

- Preview renderers for P0 components (see [Component Taxonomy](./08-component-taxonomy.md))
- Bindings UI (connect ports)
- Date range → table/chart data flow in preview
- Mock data generation (NestJS preview module)

**Exit criteria:** Filter + table + chart composite works in builder preview.

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
- MongoDB, Supabase, MySQL exporters
- Export target matrix testing

**Exit criteria:** Same composite exports to at least 3 UI × 2 server combinations.

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
