# Planned Tickets

Forward-looking Jira ticket plan for DashBuilder. **One branch at a time** — only the active ticket gets a Jira issue and feature branch; others stay as plan until the prior ticket merges to `development`.

## Completed

| Ticket | Branch | Summary |
|--------|--------|---------|
| [DAS-1](https://planetkevin.atlassian.net/browse/DAS-1) through [DAS-25](https://planetkevin.atlassian.net/browse/DAS-25) | … | See prior entries in git history |
| [DAS-26](https://planetkevin.atlassian.net/browse/DAS-26) | `feature/DAS-26-export-wizard-server-targets` | Export wizard server target picker |
| [DAS-27](https://planetkevin.atlassian.net/browse/DAS-27) | `feature/DAS-27-mongodb-exporter` | MongoDB database exporter package |
| [DAS-28](https://planetkevin.atlassian.net/browse/DAS-28) | `feature/DAS-28-supabase-exporter` | Supabase database exporter package |
| [DAS-29](https://planetkevin.atlassian.net/browse/DAS-29) | `feature/DAS-29-export-wizard-database-targets` | Export wizard database target picker |
| [DAS-30](https://planetkevin.atlassian.net/browse/DAS-30) | `feature/DAS-30-mysql-exporter` | MySQL database exporter package |

## Phase 4 — Multi-target export

| Ticket | Branch (planned) | Summary |
|--------|------------------|---------|
| [DAS-31](https://planetkevin.atlassian.net/browse/DAS-31) | `feature/DAS-31-export-target-matrix-tests` | Export target matrix testing |

## Active work

| Ticket | Branch | Status |
|--------|--------|--------|
| [DAS-31](https://planetkevin.atlassian.net/browse/DAS-31) | `feature/DAS-31-export-target-matrix-tests` | In progress |

## Delivery status

- **UI frameworks:** React, Angular, Vue, Svelte — complete
- **Server exporters:** Nest, Express, Next, Nuxt — complete
- **Database exporters:** PostgreSQL (via server exporters), MongoDB, Supabase, MySQL — complete
- **Export wizard:** UI + server + database pickers — complete
- **Export target matrix:** parameterized bundle tests — **DAS-31 in progress**

## Future — 3D dashboards (not yet ticketed)

- **three.js** integration for 3D dashboard displays — scope and component model TBD

## Related documents

- [Roadmap](./10-roadmap.md)
- [Workflow & Branching](./07-workflow-and-branching.md)
- [Component Model](./03-component-model.md)
