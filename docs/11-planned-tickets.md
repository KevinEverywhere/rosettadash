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
| [DAS-31](https://planetkevin.atlassian.net/browse/DAS-31) | `feature/DAS-31-export-target-matrix-tests` | Export target matrix testing |

## Phase 5 — Smart defaults & domain

| Ticket | Branch (planned) | Summary |
|--------|------------------|---------|
| [DAS-32](https://planetkevin.atlassian.net/browse/DAS-32) | `feature/DAS-32-defaults-engine` | Rule-based defaults engine + inspector suggestions |
| [DAS-33](https://planetkevin.atlassian.net/browse/DAS-33) | `feature/DAS-33-domain-context` | Domain context on composites, preview, and ExportIR |

## Active work

| Ticket | Branch | Status |
|--------|--------|--------|
| [DAS-33](https://planetkevin.atlassian.net/browse/DAS-33) | `feature/DAS-33-domain-context` | In progress |

## Delivery status

- **Phase 4 multi-target export:** complete
- **Defaults engine:** rule-based suggestions in core + inspector UI — complete (DAS-32)
- **Domain context:** client/project scope + default time range — **DAS-33 in progress**

## Phase 5 — planned (not yet ticketed)

- Role gates and scoped queries in export
- Onboarding composite template

## Future — 3D dashboards (not yet ticketed)

- **three.js** integration for 3D dashboard displays — scope and component model TBD

## Related documents

- [Roadmap](./10-roadmap.md)
- [Workflow & Branching](./07-workflow-and-branching.md)
- [Component Model](./03-component-model.md)
