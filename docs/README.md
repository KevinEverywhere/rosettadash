# DashBuilder Documentation

Foundational documents for the DashBuilder project. Start with the vision doc, then architecture, then dive into specifics.

## Ticket plan

See **[Planned Tickets](./11-planned-tickets.md)** for the full Jira ticket list (DAS-1–DAS-38).

**Workflow:** Jira ticket → matching branch → implement. Never skip. See [Workflow & Branching](./07-workflow-and-branching.md).

## Reading order

1. [Vision & Product Overview](./01-vision-and-product-overview.md) — what we're building and why
2. [Architecture](./02-architecture.md) — system design
3. [Component Model](./03-component-model.md) — how components and composites work
4. [Export Pipeline](./04-export-pipeline.md) — code generation flow
5. [Domain Model](./05-domain-model.md) — dashboard business context
6. [Technology Stack](./06-technology-stack.md) — chosen technologies
7. [Workflow & Branching](./07-workflow-and-branching.md) — Jira + branch gate (mandatory)
8. [Component Taxonomy](./08-component-taxonomy.md) — palette inventory
9. [Glossary](./09-glossary.md) — terms
10. [Roadmap](./10-roadmap.md) — phased delivery
11. [Planned Tickets](./11-planned-tickets.md) — Jira ticket index
12. [CI and Hosting](./12-ci-and-hosting.md) — GitHub Actions, Nx, Pages
13. [Local Development & Components](./13-local-development-and-components.md) — startup, e2e, adding components
14. [Docker Containers](./14-docker-containers.md) — run locally with Docker Compose
15. [Component & Page Design](./15-component-and-page-design.md) — single components, page patterns, implementation plan

## Active work

| Ticket | Branch | Status |
|--------|--------|--------|
| [DAS-38](https://planetkevin.atlassian.net/browse/DAS-38) | `feature/DAS-38-component-page-design-plan` | In progress — docs refresh + component/page design planning |

Completed tickets **DAS-1 through DAS-37** are listed in [Planned Tickets](./11-planned-tickets.md).

## Current capabilities (at a glance)

| Capability | Status |
|------------|--------|
| Visual builder (palette, canvas, inspector, save/load) | Shipped |
| Bindings + live preview (P0 components) | Shipped |
| Multi-target export (React/Angular/Vue/Svelte + 4 servers + 4 DBs) | Shipped |
| Defaults engine, domain context, role visibility | Shipped |
| Docker Compose local dev | Shipped |
| Full taxonomy + page template library | Phase 6 — planned |
