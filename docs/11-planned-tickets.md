# Planned Tickets

Forward-looking Jira ticket plan for DashBuilder.

**Rule:** Every change requires a **Jira ticket first**, then a **matching feature branch** (`feature/DAS-<n>-…`). One ticket at a time. See [Workflow & Branching](./07-workflow-and-branching.md) and `.cursor/rules/jira-ticket-and-branch.mdc`.

## Completed

| Ticket | Branch | Summary |
|--------|--------|---------|
| [DAS-1](https://planetkevin.atlassian.net/browse/DAS-1) | `feature/DAS-1-project-foundation` | Vision, architecture, workflow docs |
| [DAS-2](https://planetkevin.atlassian.net/browse/DAS-2) | `feature/DAS-2-monorepo-scaffold` | Nx monorepo: client, server, core |
| [DAS-3](https://planetkevin.atlassian.net/browse/DAS-3) | `feature/DAS-3-core-component-model` | Types, registry, schemas, validation |
| [DAS-4](https://planetkevin.atlassian.net/browse/DAS-4) | `feature/DAS-4-projects-api` | Projects/composites REST API |
| [DAS-5](https://planetkevin.atlassian.net/browse/DAS-5) | `feature/DAS-5-builder-shell` | Three-panel builder shell |
| [DAS-6](https://planetkevin.atlassian.net/browse/DAS-6) | `feature/DAS-6-canvas-persistence` | Canvas persistence + save |
| [DAS-7](https://planetkevin.atlassian.net/browse/DAS-7) | `feature/DAS-7-ci-baseline` | Lint, typecheck, verify scripts |
| [DAS-8](https://planetkevin.atlassian.net/browse/DAS-8) | `feature/DAS-8-playwright-e2e` | Playwright E2E + CI job |
| [DAS-9](https://planetkevin.atlassian.net/browse/DAS-9) | `feature/DAS-9-bindings-ui` | Canvas bindings UI |
| [DAS-10](https://planetkevin.atlassian.net/browse/DAS-10) | `feature/DAS-10-preview-renderers` | Preview renderers for P0 visuals |
| [DAS-11](https://planetkevin.atlassian.net/browse/DAS-11) | `feature/DAS-11-preview-mock-data` | Preview mock data API |
| [DAS-12](https://planetkevin.atlassian.net/browse/DAS-12) | `feature/DAS-12-filter-table-chart-flow` | Date range → table → chart preview |
| [DAS-13](https://planetkevin.atlassian.net/browse/DAS-13) | `feature/DAS-13-export-ir` | ExportIR builder |
| [DAS-14](https://planetkevin.atlassian.net/browse/DAS-14) | `feature/DAS-14-react-ui-exporter` | React UI exporter |
| [DAS-15](https://planetkevin.atlassian.net/browse/DAS-15) | `feature/DAS-15-nest-pg-exporter` | NestJS + PostgreSQL exporter |
| [DAS-16](https://planetkevin.atlassian.net/browse/DAS-16) | `feature/DAS-16-export-wizard` | Export wizard UI |
| [DAS-17](https://planetkevin.atlassian.net/browse/DAS-17) | `feature/DAS-17-ci-npm-lockfile` | CI npm 11 / lockfile fix |
| [DAS-18](https://planetkevin.atlassian.net/browse/DAS-18) | `feature/DAS-18-angular-ui-exporter` | Angular UI exporter |
| [DAS-19](https://planetkevin.atlassian.net/browse/DAS-19) | `feature/DAS-19-export-wizard-ui-targets` | Export wizard React/Angular picker |
| [DAS-20](https://planetkevin.atlassian.net/browse/DAS-20) | `feature/DAS-20-vue-ui-exporter` | Vue UI exporter |
| [DAS-21](https://planetkevin.atlassian.net/browse/DAS-21) | `feature/DAS-21-export-wizard-ui-polish` | Export wizard UI polish |
| [DAS-22](https://planetkevin.atlassian.net/browse/DAS-22) | `feature/DAS-22-express-server-exporter` | Express server exporter |
| [DAS-23](https://planetkevin.atlassian.net/browse/DAS-23) | `feature/DAS-23-next-server-exporter` | Next.js server exporter |
| [DAS-24](https://planetkevin.atlassian.net/browse/DAS-24) | `feature/DAS-24-nuxt-server-exporter` | Nuxt server exporter |
| [DAS-25](https://planetkevin.atlassian.net/browse/DAS-25) | `feature/DAS-25-svelte-ui-exporter` | Svelte UI exporter |
| [DAS-26](https://planetkevin.atlassian.net/browse/DAS-26) | `feature/DAS-26-export-wizard-server-targets` | Export wizard server target picker |
| [DAS-27](https://planetkevin.atlassian.net/browse/DAS-27) | `feature/DAS-27-mongodb-exporter` | MongoDB database exporter |
| [DAS-28](https://planetkevin.atlassian.net/browse/DAS-28) | `feature/DAS-28-supabase-exporter` | Supabase database exporter |
| [DAS-29](https://planetkevin.atlassian.net/browse/DAS-29) | `feature/DAS-29-export-wizard-database-targets` | Export wizard database target picker |
| [DAS-30](https://planetkevin.atlassian.net/browse/DAS-30) | `feature/DAS-30-mysql-exporter` | MySQL database exporter |
| [DAS-31](https://planetkevin.atlassian.net/browse/DAS-31) | `feature/DAS-31-export-target-matrix-tests` | Export target matrix testing |
| [DAS-32](https://planetkevin.atlassian.net/browse/DAS-32) | `feature/DAS-32-defaults-engine` | Defaults engine + inspector suggestions |
| [DAS-33](https://planetkevin.atlassian.net/browse/DAS-33) | `feature/DAS-33-domain-context` | Domain context on composites, preview, ExportIR |
| [DAS-34](https://planetkevin.atlassian.net/browse/DAS-34) | `feature/DAS-34-role-visibility` | Role visibility in builder + export stubs |
| [DAS-35](https://planetkevin.atlassian.net/browse/DAS-35) | `feature/DAS-35-scoped-query-filters` | Scoped query filters in exporters |
| [DAS-36](https://planetkevin.atlassian.net/browse/DAS-36) | `feature/DAS-36-onboarding-template` | Onboarding composite template + export stubs |
| [DAS-37](https://planetkevin.atlassian.net/browse/DAS-37) | `feature/DAS-37-docker-local-containers` | Docker Compose local dev + Jira/branch workflow enforcement |
| [DAS-38](https://planetkevin.atlassian.net/browse/DAS-38) | `feature/DAS-38-component-page-design-plan` | Docs refresh + component/page design planning |
| [DAS-39](https://planetkevin.atlassian.net/browse/DAS-39) | `feature/DAS-39-p1-form-inputs` | P1 form inputs (number, checkbox, textarea) |
| [DAS-40](https://planetkevin.atlassian.net/browse/DAS-40) | `feature/DAS-40-page-template-library` | Page template library + e2e port prep |
| [DAS-41](https://planetkevin.atlassian.net/browse/DAS-41) | `feature/DAS-41-export-wizard-scope` | Export wizard full / single / selection scopes |
| [DAS-42](https://planetkevin.atlassian.net/browse/DAS-42) | `feature/DAS-42-canvas-layout-polish` | Canvas snap, resize, multi-select |
| [DAS-43](https://planetkevin.atlassian.net/browse/DAS-43) | `feature/DAS-43-component-grouping-guides` | Grouping guides + companion prompts |
| [DAS-44](https://planetkevin.atlassian.net/browse/DAS-44) | `feature/DAS-44-palette-accordion-groups` | Palette functional accordion groups |
| [DAS-45](https://planetkevin.atlassian.net/browse/DAS-45) | `feature/DAS-45-undo-redo` | Builder undo/redo |
| [DAS-46](https://planetkevin.atlassian.net/browse/DAS-46) | `feature/DAS-46-pie-chart-flex-layout` | Pie chart + flex layout |
| [DAS-47](https://planetkevin.atlassian.net/browse/DAS-47) | `feature/DAS-47-detail-panel` | Detail panel for table drill-down |
| [DAS-48](https://planetkevin.atlassian.net/browse/DAS-48) | `feature/DAS-48-time-preset` | Domain time preset filter |
| [DAS-49](https://planetkevin.atlassian.net/browse/DAS-49) | `feature/DAS-49-skeleton` | Loading skeleton visual component |
| [DAS-50](https://planetkevin.atlassian.net/browse/DAS-50) | `feature/DAS-50-logic-timer` | Logic timer + Phase 6 doc closeout |
| [DAS-51](https://planetkevin.atlassian.net/browse/DAS-51) | `feature/DAS-51-builder-auth` | Optional builder API key authentication |
| [DAS-52](https://planetkevin.atlassian.net/browse/DAS-52) | `feature/DAS-52-composite-version-diff` | Composite version history and diff |

## Active work

| Ticket | Branch | Status |
|--------|--------|--------|
| [DAS-52](https://planetkevin.atlassian.net/browse/DAS-52) | `feature/DAS-52-composite-version-diff` | In progress — composite version history and diff |

## Delivery status

- **Phases 0–3 (foundation → export MVP):** complete (DAS-1–DAS-16)
- **Phase 4 multi-target export:** complete (DAS-17–DAS-31)
- **Phase 5 smart defaults & domain:** complete (DAS-32–DAS-36)
- **Docker local containers:** complete (DAS-37)
- **Phase 6 component & page design:** complete (DAS-39–DAS-49)
- **Phase 7 production hardening:** in progress (DAS-50–DAS-52)

## Phase 6 — complete

See [Component & Page Design](./15-component-and-page-design.md) for patterns. All planned Phase 6 tickets shipped:

1. ~~P1 form inputs (number, checkbox, textarea)~~ — DAS-39
2. ~~Page template library (analytics, CRUD, settings)~~ — DAS-40
3. ~~Export wizard: single/selection modes~~ — DAS-41
4. ~~Canvas layout polish (snap, resize, multi-select)~~ — DAS-42
5. ~~Undo/redo~~ — DAS-45
6. ~~Pie chart + flex layout~~ — DAS-46
7. ~~Detail panel~~ — DAS-47
8. ~~`domain.time-preset`~~ — DAS-48
9. ~~`visual.skeleton`~~ — DAS-49
10. ~~Component grouping guides & animated placement hints~~ — DAS-43
11. ~~Palette accordion reorganization (2–7 items per group)~~ — DAS-44

## Phase 7 — planned (create Jira ticket before each)

1. ~~`logic.timer`~~ — DAS-50
2. ~~Builder authentication~~ — DAS-51
3. ~~Project versioning and diff~~ — DAS-52
4. Large composite performance
5. Exporter plugin SDK documentation

## Future — 3D dashboards (not yet ticketed)

- **three.js** integration — scope TBD

## Related documents

- [Roadmap](./10-roadmap.md)
- [Component & Page Design](./15-component-and-page-design.md)
- [Workflow & Branching](./07-workflow-and-branching.md)
- [Component Model](./03-component-model.md)
