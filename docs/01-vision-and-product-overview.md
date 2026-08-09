# Vision & Product Overview

## Mission

DashBuilder empowers developers and technical users to design dashboard components visually and export production-ready code for the frameworks and infrastructure they already use—without locking them into a proprietary runtime.

## Problem

Dashboard UIs are repetitive to build: forms, data tables, charts, filters, role-based views, time ranges, and drag-and-drop layouts appear in nearly every internal tool. Teams rebuild the same patterns in React, Angular, or Vue, wire them to different backends, and duplicate styling and behavior logic. Existing low-code tools often produce opaque output or tie users to a single stack.

## Solution

DashBuilder is a **component factory with a visual composer**:

1. Users pick primitives from a palette (inputs, tables, charts, layout regions, timers, animations).
2. They configure each piece and drag them together on a canvas.
3. They attach **invisible infrastructure nodes**—database connections, server framework choices, environment variables—that define how exported code runs.
4. DashBuilder suggests practical defaults (chart type for time-series data, pagination for large tables, role-gated routes) that users can accept or override.
5. The tool exports **single components or composite groups** as real source files: templates, styles, scripts, and config stubs.

## Target users

| Persona | Need |
|---------|------|
| **Full-stack developer** | Ship dashboard widgets fast without rewriting boilerplate |
| **Frontend specialist** | Export React/Vue/Angular components that match team conventions |
| **Technical product owner** | Prototype dashboards before handing off to engineering |
| **Agency / consultant** | Deliver client dashboards across different tech stacks |

## Core concepts

### Piecemeal construction

Components are built incrementally. A user might start with a date-range filter, add a KPI card, connect a chart, then wrap them in a responsive grid. Each piece remains independently editable and exportable.

### Composites

A **composite** is a named group of components (visible and invisible) with defined relationships:

- Layout parent/child (grid cell contains chart)
- Data binding (table reads from PostgreSQL node)
- Event wiring (filter change refreshes chart)
- Role visibility (admin-only settings panel)

Composites can be nested and reused as templates.

### Invisible components

Not everything on the canvas is rendered. **Infrastructure nodes** represent:

- Database connections (MongoDB, PostgreSQL, Supabase, MySQL)
- Server/runtime choice (Next.js API routes, Nuxt server, NestJS module, Express router)
- Environment variable maps (connection strings, API keys—never hard-coded in exports)
- Auth/session providers (future)
- Background jobs / schedulers (future)

These nodes participate in export the same way visual components do—they generate config files, env templates, and server-side stubs.

### Multi-framework export

The builder itself is Angular (client + NestJS server during creation). Exported artifacts target user-selected frameworks:

| UI framework | Initial support |
|--------------|-----------------|
| React | Yes |
| Angular | Yes |
| Vue | Yes |
| Svelte | Yes |

| Server partner | Initial support |
|----------------|-----------------|
| Next.js | Yes |
| Nuxt | Yes |
| NestJS | Yes |
| Express | Yes |

| Database | Initial support |
|----------|-----------------|
| MongoDB | Yes |
| PostgreSQL | Yes |
| Supabase | Yes |
| MySQL | Yes |

### Smart defaults

DashBuilder acts as a design partner:

- Suggesting chart types based on bound data shape
- Pre-wiring CRUD tables to REST patterns matching the chosen server
- Recommending pagination thresholds
- Proposing role-based layout variants for common dashboard patterns (viewer vs editor vs admin)
- Offering sensible styling tokens (spacing, typography) consistent across exports

Defaults are always overridable; the tool explains *why* it suggests something.

## Dashboard domain expectations

Real dashboards are not just widgets—they encode business context:

- **Time-based** — date ranges, relative periods, comparison windows
- **Project-based** — scoped data per initiative or workspace
- **Client-based** — multi-tenant or account segmentation
- **Role-based** — multiple persons in multiple roles with different capabilities
- **Onboarding** — flows to add persons, assign roles, grant access
- **Historical vs live data** — toggling old vs new records in table, chart, or custom views

DashBuilder's domain model (see [05-domain-model.md](./05-domain-model.md)) captures these concepts so exported components can include filters, guards, and data scoping out of the box.

## Success criteria (product)

1. A user can build a filter + table + chart composite in under 30 minutes.
2. Exported code runs in a fresh project with only env vars configured.
3. Switching export target (React → Vue) regenerates equivalent behavior without redesigning the canvas.
4. Adding a new framework exporter does not require changes to the builder UI core.

## Non-goals (initial release)

- Hosting or running user dashboards in production (export-only)
- Replacing full application frameworks
- Visual custom CSS editor (token-based theming first)
- Real-time multi-user collaborative editing (future consideration)

## Related documents

- [Architecture](./02-architecture.md)
- [Component Model](./03-component-model.md)
- [Export Pipeline](./04-export-pipeline.md)
- [Roadmap](./10-roadmap.md)
