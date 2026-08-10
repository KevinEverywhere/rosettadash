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
16. [Exporter Plugin SDK](./16-exporter-plugin-sdk.md) — adding UI/server/database code generators
17. [Component Plugin SDK](./17-component-plugin-sdk.md) — registering custom palette and preview components
18. [Display Availability](./19-display-availability.md) — phone/tablet/desktop tiers and builder gating
19. [AI & BYOK Integration](./20-ai-and-byok-integration.md) — BYOK key management and AI-assisted creation (Phases 19–20)
20. [Builder Creation Assistance](./21-builder-creation-assistance.md) — animated guides for common components (Phase 18, DAS-69)
21. [Demo Dashboards](./22-demo-dashboards.md) — three animated example dashboards (Phase 21, post–Phase 20)
22. [Content Library](./23-content-library.md) — user-controlled save/revisit (DAS-71, spec)

## Active work

See [Planned Tickets](./11-planned-tickets.md) for current backlog. **Phase 19 (DAS-70)** — BYOK key management — is in progress.

## Current capabilities (at a glance)

| Capability | Status |
|------------|--------|
| Visual builder (palette, canvas, inspector, save/load) | Shipped |
| Bindings + live preview (P0 components) | Shipped |
| Multi-target export (React/Angular/Vue/Svelte + 4 servers + 4 DBs) | Shipped |
| Defaults engine, domain context, role visibility | Shipped |
| Display availability gate (phone / tablet portrait) | Shipped (DAS-66) |
| Compact builder layout (tablet / small desktop) | Shipped (DAS-67) |
| Welcome onboarding UX (empty stack, confirmations) | Shipped (DAS-68) |
| Builder creation assistance (animated guides) | Shipped (DAS-69) |
| BYOK key management | DAS-70 — in progress (Phase 19) |
| AI-assisted component creation | Phase 20 — planned (DAS-71) |
| Animated demo dashboards (3 examples) | Phase 21 — planned after Phase 20 |
| Docker Compose local dev | Shipped |
| Full taxonomy + page template library | Phase 6 — complete |
| Phase 7 production hardening | Complete (DAS-50–DAS-54) |
| Phase 8 component plugins & 3D | Complete (DAS-55–DAS-56) |
