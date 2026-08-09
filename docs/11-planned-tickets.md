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
| [DAS-19](https://planetkevin.atlassian.net/browse/DAS-19) | `feature/DAS-19-export-wizard-ui-targets` | Export wizard UI target picker |
| [DAS-20](https://planetkevin.atlassian.net/browse/DAS-20) | `feature/DAS-20-vue-ui-exporter` | Vue UI exporter package |
| [DAS-21](https://planetkevin.atlassian.net/browse/DAS-21) | `feature/DAS-21-export-wizard-ui-polish` | Export wizard UI target polish |
| [DAS-22](https://planetkevin.atlassian.net/browse/DAS-22) | `feature/DAS-22-express-server-exporter` | Express server exporter package |
| [DAS-23](https://planetkevin.atlassian.net/browse/DAS-23) | `feature/DAS-23-next-server-exporter` | Next.js server exporter package |

## Phase 4 — Multi-target export

| Ticket | Branch (planned) | Summary |
|--------|------------------|---------|
| [DAS-24](https://planetkevin.atlassian.net/browse/DAS-24) | `feature/DAS-24-nuxt-server-exporter` | Nuxt server exporter package |
| [DAS-25](https://planetkevin.atlassian.net/browse/DAS-25) | `feature/DAS-25-svelte-ui-exporter` | Svelte UI exporter (4th UI framework) |

## Active work

| Ticket | Branch | Status |
|--------|--------|--------|
| [DAS-24](https://planetkevin.atlassian.net/browse/DAS-24) | `feature/DAS-24-nuxt-server-exporter` | In progress |

## UI framework delivery order

1. React — DAS-14 (done)
2. Angular — DAS-18 (done)
3. Vue — DAS-20 (done)
4. **Svelte — DAS-25 (planned next after server exporters)**

## Phase 4 — planned (not yet ticketed)

- MongoDB, Supabase, MySQL exporters
- Export target matrix testing
- Export wizard server-target picker (Nest / Express / Next / Nuxt)

## Future — 3D dashboards (not yet ticketed)

- **three.js** integration for 3D dashboard displays — scope and component model TBD

## Related documents

- [Roadmap](./10-roadmap.md)
- [Workflow & Branching](./07-workflow-and-branching.md)
- [Component Model](./03-component-model.md)
