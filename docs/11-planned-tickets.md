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

## Phase 2 — Preview & P0 palette

| Ticket | Branch (planned) | Summary |
|--------|------------------|---------|
| [DAS-10](https://planetkevin.atlassian.net/browse/DAS-10) | `feature/DAS-10-preview-renderers` | Builder-side preview for P0 visual components |
| DAS-11 | `feature/DAS-11-mock-data-api` | NestJS preview module with mock row generation |
| DAS-12 | `feature/DAS-12-filter-table-chart-flow` | Date range → table → chart binding demo |

## Phase 3 — Export MVP

| Ticket | Branch (planned) | Summary |
|--------|------------------|---------|
| [DAS-12](https://planetkevin.atlassian.net/browse/DAS-12) | `feature/DAS-12-export-ir` | Build ExportIR from validated composite |
| DAS-13 | `feature/DAS-13-react-exporter` | React UI exporter (P0 components) |
| DAS-14 | `feature/DAS-14-nest-pg-exporter` | NestJS + PostgreSQL infra exporter |
| DAS-15 | `feature/DAS-15-export-wizard` | Export wizard UI + zip download |

## Active work

| Ticket | Branch | Status |
|--------|--------|--------|
| [DAS-10](https://planetkevin.atlassian.net/browse/DAS-10) | `feature/DAS-10-preview-renderers` | In progress |

## Related documents

- [Roadmap](./10-roadmap.md)
- [Workflow & Branching](./07-workflow-and-branching.md)
- [Component Model](./03-component-model.md)
