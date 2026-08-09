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
| [DAS-32](https://planetkevin.atlassian.net/browse/DAS-32) | `feature/DAS-32-defaults-engine` | Rule-based defaults engine + inspector suggestions |
| [DAS-33](https://planetkevin.atlassian.net/browse/DAS-33) | `feature/DAS-33-domain-context` | Domain context on composites, preview, and ExportIR |
| [DAS-34](https://planetkevin.atlassian.net/browse/DAS-34) | `feature/DAS-34-role-visibility` | Role visibility in builder + export stubs |
| [DAS-35](https://planetkevin.atlassian.net/browse/DAS-35) | `feature/DAS-35-scoped-query-filters` | Scoped query filters in exporters |
| [DAS-36](https://planetkevin.atlassian.net/browse/DAS-36) | `feature/DAS-36-onboarding-template` | Onboarding composite template + export stubs |

## Active work

| Ticket | Branch | Status |
|--------|--------|--------|
| — | — | Phase 6 not yet ticketed |

## Delivery status

- **Phase 4 multi-target export:** complete
- **Phase 5 smart defaults & domain:** complete (DAS-32 through DAS-36)
- **Phase 6 advanced UX:** not started

## Phase 6 — planned (not yet ticketed)

Suggested order (create Jira tickets when ready):

1. **Composite templates library** — palette or modal to browse/apply templates (onboarding is first; save custom composites as templates)
2. **Undo/redo** — builder history stack for node/property/binding edits
3. **Canvas layout polish** — snap grid, resize handles, multi-select
4. **Export README improvements** — per-target setup docs in generated bundles

## Future — 3D dashboards (not yet ticketed)

- **three.js** integration for 3D dashboard displays — scope and component model TBD

## Related documents

- [Roadmap](./10-roadmap.md)
- [Workflow & Branching](./07-workflow-and-branching.md)
- [Component Model](./03-component-model.md)
