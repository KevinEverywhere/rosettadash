# Architecture

## High-level overview

DashBuilder splits into two runtime contexts:

| Context | Purpose | Stack |
|---------|---------|-------|
| **Builder runtime** | Visual design, preview, export | Angular (client) + NestJS (server) |
| **Exported runtime** | User's application | User-selected framework + server + DB |

```
┌─────────────────────────────────────────────────────────────────┐
│                     BUILDER RUNTIME                              │
│  ┌──────────────┐    REST/WS     ┌──────────────┐               │
│  │ Angular      │◄──────────────►│ NestJS       │               │
│  │ Client       │                │ Server       │               │
│  │              │                │              │               │
│  │ • Canvas     │                │ • Projects   │               │
│  │ • Palette    │                │ • Composites │               │
│  │ • Preview    │                │ • Export     │               │
│  │ • Properties │                │ • Templates  │               │
│  └──────────────┘                └──────────────┘               │
│         │                                │                       │
│         └────────────┬───────────────────┘                       │
│                      ▼                                           │
│              ┌──────────────┐                                    │
│              │ packages/core│  Component model, export IR        │
│              └──────────────┘                                    │
└─────────────────────────────────────────────────────────────────┘
                       │
                       │ export (zip / file tree)
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXPORTED RUNTIME (user app)                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │ React /      │    │ Next / Nuxt /│    │ MongoDB /    │     │
│  │ Angular / Vue│◄──►│ Nest / Express│◄──►│ PG / Supa /  │     │
│  └──────────────┘    └──────────────┘    │ MySQL        │     │
│                                           └──────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

## Monorepo layout

```
dashbuilder/
├── apps/
│   ├── client/                 # Angular standalone builder app
│   │   └── src/app/
│   │       ├── canvas/         # Design surface
│   │       ├── palette/        # Component library sidebar
│   │       ├── inspector/      # Property editor + defaults hints
│   │       ├── preview/        # Live preview renderer
│   │       └── export/         # Export wizard UI
│   ├── server/                 # NestJS API
│   │   └── src/
│   │       ├── auth/           # Optional API key gate
│   │       ├── projects/       # Project + composite CRUD
│   │       ├── export/         # Export orchestration
│   │       └── preview/        # Mock preview data
│   └── client-e2e/             # Playwright E2E
├── packages/
│   ├── core/                   # Component model, registry, IR, validation
│   ├── ui-primitives/          # Preview mock data helpers
│   ├── exporters-react/        # React UI code generator
│   ├── exporters-angular/      # Angular UI code generator
│   ├── exporters-vue/          # Vue UI code generator
│   ├── exporters-svelte/       # Svelte UI code generator
│   ├── exporters-nest/         # NestJS + PostgreSQL server generator
│   ├── exporters-express/      # Express server generator
│   ├── exporters-next/         # Next.js server generator
│   ├── exporters-nuxt/         # Nuxt server generator
│   ├── exporters-mongodb/      # MongoDB layer generator
│   ├── exporters-supabase/     # Supabase layer generator
│   └── exporters-mysql/        # MySQL layer generator
├── docker/                     # nginx + entrypoint for app image
├── docs/
├── Dockerfile                  # Production-style app image
├── Dockerfile.dev              # Dev hot-reload image
└── docker-compose.yml          # dev + app profiles
```

## Builder client (Angular)

### Responsibilities

- Render the design canvas with drag-and-drop (CDK Drag Drop or similar)
- Display component palette organized by taxonomy
- Edit component properties via inspector panel
- Show live preview (builder-side approximation of exported behavior)
- Manage composite graph state (nodes, edges, bindings)
- Trigger export jobs and download artifacts
- Surface smart-default suggestions

### Key modules

| Module | Role |
|--------|------|
| `CanvasModule` | Spatial layout, selection, snapping, grouping |
| `PaletteModule` | Searchable component catalog |
| `InspectorModule` | Schema-driven property forms |
| `GraphModule` | Composite DAG: visual + infrastructure nodes |
| `PreviewModule` | Renders IR locally for WYSIWYG feedback |
| `ExportModule` | Wizard: pick targets, review env vars, download |
| `ProjectModule` | Open/save projects, metadata |

### State management

- **Project state** — persisted via NestJS API (in-memory MVP)
- **Canvas state** — in-memory Angular signals in the builder client
- **Undo/redo** — DAS-45 (Phase 6); snapshot history over graph mutations

## Builder server (NestJS)

### Responsibilities

- Persist projects, composites, and user configurations
- Validate composite graphs before export
- Orchestrate multi-target export (parallel generator invocation)
- Serve preview data (mock or connected DB for testing during design)
- Manage export templates and default suggestion rules

### Key modules

| Module | Role |
|--------|------|
| `ProjectsModule` | Project CRUD, versioning |
| `CompositesModule` | Graph storage, validation |
| `ExportModule` | Runs exporters, packages zip |
| `DefaultsModule` | Rule engine for smart suggestions |
| `PreviewModule` | Sample data, schema introspection helpers |

### API style

REST first; WebSocket optional later for export progress and collaborative editing.

## Shared core (`packages/core`)

The **single source of truth** for:

- Component type definitions and property schemas
- Composite graph structure (nodes, ports, bindings)
- Intermediate Representation (IR) consumed by all exporters
- Validation rules (e.g., database node must connect to data-bound component)

Exporters never parse the raw canvas JSON directly—they consume validated IR.

## Export architecture

```
Canvas Graph  →  Validate  →  IR  →  Exporter(s)  →  File tree / zip
```

See [04-export-pipeline.md](./04-export-pipeline.md) for detail.

## Extensibility

### Adding a UI framework

1. Create `packages/exporters-<framework>/` implementing `generate*Files(ir) → GeneratedFile[]`
2. Add descriptor to `builtInExporterManifest` in `@dashbuilder/core`
3. Wire dispatch in `apps/server/src/app/export/export.service.ts`
4. Palette and property schemas stay framework-agnostic

See **[Exporter Plugin SDK](./16-exporter-plugin-sdk.md)** for the full checklist.

### Adding a custom component (plugin)

1. Define a `ComponentPlugin` and call `registry.registerPlugin()`
2. Assign a palette group (2–7 items per group)
3. Register a client preview adapter

See **[Component Plugin SDK](./17-component-plugin-sdk.md)** — foundation for three.js and third-party palette plugins.

### Adding a server partner

1. Implement server stub generator (routes, modules, middleware)
2. Map IR data-access patterns to partner conventions

### Adding a database

1. Define connection schema (env vars, driver)
2. Implement query/ORM snippet generators per server partner

## Security considerations

- **Secrets never in exports** — only env var placeholders and `.env.example`
- **Builder server** — optional API key auth via `BUILDER_AUTH_ENABLED` + `BUILDER_API_KEY` (DAS-51); projects may become user-scoped later
- **Preview DB connections** — sandboxed, read-only by default during design
- **Export validation** — block export if hard-coded credentials detected

## Deployment (builder itself)

| Environment | Client | Server |
|-------------|--------|--------|
| Local dev | `ng serve` | `nest start --watch` |
| Local Docker | Dev container (`npm run docker:dev`) or app image (`npm run docker:app`) | Same compose stack — see [Docker Containers](./14-docker-containers.md) |
| Staging/prod | Static hosting or SSR | Node container |

Exact hosting TBD; not blocking initial development.

## Related documents

- [Component Model](./03-component-model.md)
- [Export Pipeline](./04-export-pipeline.md)
- [Technology Stack](./06-technology-stack.md)
- [Component & Page Design](./15-component-and-page-design.md)
- [Exporter Plugin SDK](./16-exporter-plugin-sdk.md)
