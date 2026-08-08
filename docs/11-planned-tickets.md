# Planned Tickets

Forward-looking Jira ticket plan for DashBuilder. **One branch at a time** — only the active ticket gets a Jira issue and feature branch; others stay as plan until the prior ticket merges to `development`.

## Completed

| Ticket | Branch | Summary |
|--------|--------|---------|
| [DAS-1](https://planetkevin.atlassian.net/browse/DAS-1) | `feature/DAS-1-project-foundation` | Vision, architecture, workflow docs |
| [DAS-2](https://planetkevin.atlassian.net/browse/DAS-2) | `feature/DAS-2-monorepo-scaffold` | Nx monorepo: client, server, core |
| [DAS-3](https://planetkevin.atlassian.net/browse/DAS-3) | `feature/DAS-3-core-component-model` | Types, registry, schemas, validation |
| [DAS-4](https://planetkevin.atlassian.net/browse/DAS-4) | `feature/DAS-4-projects-api` | Projects/composites REST API |
| [DAS-5](https://planetkevin.atlassian.net/browse/DAS-5) | `feature/DAS-5-builder-shell` | Builder shell UI |
| [DAS-6](https://planetkevin.atlassian.net/browse/DAS-6) | `feature/DAS-6-canvas-persistence` | Canvas persistence |
| [DAS-7](https://planetkevin.atlassian.net/browse/DAS-7) | `feature/DAS-7-ci-baseline` | Typecheck, verify, GitHub Actions |
| [DAS-8](https://planetkevin.atlassian.net/browse/DAS-8) | `feature/DAS-8-e2e-smoke` | Playwright E2E smoke test |
| [DAS-9](https://planetkevin.atlassian.net/browse/DAS-9) | `feature/DAS-9-bindings-ui` | Bindings UI |
| [DAS-10](https://planetkevin.atlassian.net/browse/DAS-10) | `feature/DAS-10-preview-renderers` | Preview renderers |
| [DAS-11](https://planetkevin.atlassian.net/browse/DAS-11) | `feature/DAS-11-mock-data-api` | Mock data API |
| [DAS-12](https://planetkevin.atlassian.net/browse/DAS-12) | `feature/DAS-12-filter-table-chart-flow` | Preview binding flow |
| [DAS-13](https://planetkevin.atlassian.net/browse/DAS-13) | `feature/DAS-13-export-ir` | ExportIR builder |
| [DAS-14](https://planetkevin.atlassian.net/browse/DAS-14) | `feature/DAS-14-react-exporter` | React UI exporter |
| [DAS-15](https://planetkevin.atlassian.net/browse/DAS-15) | `feature/DAS-15-nest-pg-exporter` | NestJS + PostgreSQL exporter |
| [DAS-16](https://planetkevin.atlassian.net/browse/DAS-16) | `feature/DAS-16-export-wizard` | Export wizard UI + zip download |
| [DAS-17](https://planetkevin.atlassian.net/browse/DAS-17) | `feature/DAS-17-fix-ci-npm-global` | Fix CI npm version for lockfile compatibility |
| [DAS-18](https://planetkevin.atlassian.net/browse/DAS-18) | `feature/DAS-18-angular-ui-exporter` | Angular UI exporter package |

## Phase 3 — Export MVP (complete)

Phase 3 exit criteria met: ExportIR, React + Nest/PostgreSQL exporters, export wizard, bundle zip download.

## Phase 4 — Multi-target export

| Ticket | Branch (planned) | Summary |
|--------|------------------|---------|
| [DAS-19](https://planetkevin.atlassian.net/browse/DAS-19) | `feature/DAS-19-export-wizard-ui-targets` | Export wizard UI target picker |

## Active work

| Ticket | Branch | Status |
|--------|--------|--------|
| [DAS-19](https://planetkevin.atlassian.net/browse/DAS-19) | `feature/DAS-19-export-wizard-ui-targets` | In progress |

## Phase 4 — planned (not yet ticketed)

- Vue UI exporter
- Express / Next.js / Nuxt server exporters
- MongoDB, Supabase, MySQL exporters
- Export target matrix testing

## Related documents

- [Roadmap](./10-roadmap.md)
- [Workflow & Branching](./07-workflow-and-branching.md)
- [Component Model](./03-component-model.md)
