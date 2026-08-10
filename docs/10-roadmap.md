# Roadmap

Phased delivery plan for DashBuilder. Tickets are tracked in Jira (DAS project); see [Planned Tickets](./11-planned-tickets.md).

## Phase 0 — Foundation (complete)

**Tickets:** DAS-1 through DAS-8

- [x] Vision, architecture, and workflow documentation
- [x] `development` branch as integration target
- [x] Monorepo scaffold (Angular client + NestJS server + packages/core)
- [x] Core model, projects API, builder shell, canvas persistence
- [x] CI verify baseline (`npm run verify` + GitHub Actions)
- [x] Playwright E2E smoke test

## Phase 1 — Core model & builder shell (complete)

**Tickets:** DAS-3 through DAS-6

- [x] Component type registry and JSON schemas in `packages/core`
- [x] Composite graph CRUD API (NestJS)
- [x] Angular shell: palette, canvas, inspector
- [x] Project save/load
- [x] Basic validation rules (draft + strict modes)

## Phase 2 — Preview & P0 palette (complete)

**Tickets:** DAS-9 through DAS-12

- [x] Bindings UI (connect ports)
- [x] Preview renderers for P0 components
- [x] Mock data generation (NestJS preview module)
- [x] Date range → table/chart data flow in preview

## Phase 3 — Export MVP (complete)

**Tickets:** DAS-13 through DAS-16

- [x] IR builder from validated graph
- [x] React UI exporter (P0 components)
- [x] NestJS server exporter + PostgreSQL infra exporter
- [x] Export wizard + zip download
- [x] `.env.example` generation

## Phase 4 — Multi-target export (complete)

**Tickets:** DAS-17 through DAS-31

- [x] Angular, Vue, and Svelte UI exporters
- [x] Next.js, Nuxt, Express server exporters
- [x] MongoDB, Supabase, MySQL exporters
- [x] Export target matrix testing

## Phase 5 — Smart defaults & domain (complete)

**Tickets:** DAS-32 through DAS-36

- [x] Defaults engine (rule-based suggestions)
- [x] Domain context: client, project, roles
- [x] Role gates and scoped queries in export
- [x] Onboarding composite template

## Infrastructure — Docker local dev (complete)

**Ticket:** DAS-37

- [x] Docker Compose profiles for dev and production-style app image
- [x] Mandatory Jira + branch workflow documentation

## Phase 6 — Component & page design (complete)

**Tickets:** DAS-38 through DAS-49

Expand from the original **21-type P0 registry** toward full taxonomy coverage and reusable **page templates** built from component groups.

Shipped:

- P1 single components (form inputs, pie chart, flex layout, detail panel, time preset, skeleton)
- Page template library (analytics, CRUD, settings, onboarding variants)
- Export wizard: single-component and selection export modes
- Canvas UX: undo/redo, snap, resize, multi-select
- Palette accordion groups and component grouping guides

Design reference: [Component & Page Design](./15-component-and-page-design.md).

## Phase 7 — Production hardening (complete)

**Ticket:** DAS-54 closed out Phase 7 (exporter plugin SDK)

- [x] `logic.timer` — interval/countdown ticks (DAS-50)
- [x] Builder authentication — optional API key gate (DAS-51)
- [x] Project versioning and diff — revision history + inspector diff (DAS-52)
- [x] Large composite performance — batched layout, culling, debounced preview (DAS-53)
- [x] Exporter plugin SDK — core manifest + documentation (DAS-54)

## Phase 8 — Component plugins & 3D (complete)

**Tickets:** DAS-55, DAS-56

- [x] Custom component SDK — registry, preview adapters, extension demos (DAS-55)
- [x] First three.js visual — 3D bar chart + VR palette group (DAS-56)

## Phase 9 — Project stack setup (complete)

**Ticket:** DAS-57 — framework-first entry screen

- [x] UI framework selection at project level (React / Angular / Vue / Svelte / **Any**)
- [x] Entry screen for stack pieces (UI + server + database) with compatible second-level defaults
- [x] Export wizard and builder consume persisted stack profile

## Phase 10 — VR / 3D expansion (complete)

**Tickets:** DAS-58, DAS-60

- [x] Rowset x/y/z field mapping in preview (3D scatter) — DAS-58
- [x] React R3F scatter export stub — DAS-58
- [x] 3D scene point-cloud field mapping — DAS-60
- [x] React R3F scene point-cloud export stub — DAS-60

## Phase 11 — Welcome & entry (complete)

**Ticket:** DAS-59 — welcome page with tech stack selection

- [x] Welcome landing at `/` with product intro + stack picker
- [x] Redirect fresh `/builder` visits to welcome until stack is chosen
- [x] Preserve session restore and DAS-57 stack profile behavior

## Phase 12 — Multi-target 3D export (complete)

**Tickets:** DAS-61, DAS-62

- [x] Vue TresJS stubs for bar chart, scatter, and scene — DAS-61
- [x] Svelte Threlte stubs for bar chart, scatter, and scene — DAS-61
- [x] Angular three.js canvas stubs for bar chart, scatter, and scene — DAS-61
- [x] GLTF model host preview + multi-target export stubs — DAS-62

## Future — VR / 3D expansion

- Geo globes

## Backlog ideas (unscheduled)

- Real-time collaborative editing
- Tailwind token export
- CLI export (`npx dashbuilder export`)
- Hosted preview URLs
- Custom component SDK for third-party palette plugins
- ~~Framework-first project stack entry screen~~ — DAS-57 (complete)
- ~~Welcome page with stack selection above builder~~ — DAS-59 (complete)

## Ticket creation guidance

When creating Jira tickets:

1. One deliverable per ticket where possible
2. Include acceptance criteria checklist
3. Reference docs sections and branch name in description
4. Label by phase when Jira labels available

## Related documents

- [Planned Tickets](./11-planned-tickets.md)
- [Component & Page Design](./15-component-and-page-design.md)
- [Workflow & Branching](./07-workflow-and-branching.md)
- [Technology Stack](./06-technology-stack.md)
- [Component Taxonomy](./08-component-taxonomy.md)
