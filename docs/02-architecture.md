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

## Monorepo layout (planned)

```
dashbuilder/
├── apps/
│   ├── client/                 # Angular standalone app
│   │   ├── src/app/
│   │   │   ├── canvas/         # Drag-drop design surface
│   │   │   ├── palette/        # Component library sidebar
│   │   │   ├── inspector/      # Property editor
│   │   │   ├── preview/        # Live preview renderer
│   │   │   └── export/         # Export wizard UI
│   │   └── ...
│   └── server/                 # NestJS API
│       ├── src/
│       │   ├── projects/       # CRUD for builder projects
│       │   ├── composites/     # Composite graph persistence
│       │   ├── export/         # Export orchestration
│       │   └── preview/        # Server-side preview helpers
│       └── ...
├── packages/
│   ├── core/                   # Shared TypeScript
│   │   ├── model/              # Component, Composite, Binding types
│   │   ├── ir/                 # Intermediate representation for export
│   │   └── validation/         # Graph validation rules
│   ├── exporters/              # Code generators
│   │   ├── react/
│   │   ├── angular/
│   │   ├── vue/
│   │   ├── next/
│   │   ├── nuxt/
│   │   ├── nest/
│   │   └── express/
│   └── ui-primitives/          # Builder-side renderers for palette items
└── docs/
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

- **Project state** — persisted via NestJS API
- **Canvas state** — in-memory reactive store (signals or NgRx, TBD in implementation ticket)
- **Undo/redo** — command pattern over graph mutations

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

1. Implement `ExporterPlugin` interface in `packages/exporters/<framework>/`
2. Register in exporter manifest
3. Palette and property schemas unchanged (framework-agnostic)

### Adding a server partner

1. Implement server stub generator (routes, modules, middleware)
2. Map IR data-access patterns to partner conventions

### Adding a database

1. Define connection schema (env vars, driver)
2. Implement query/ORM snippet generators per server partner

## Security considerations

- **Secrets never in exports** — only env var placeholders and `.env.example`
- **Builder server** — auth TBD; projects may be user-scoped
- **Preview DB connections** — sandboxed, read-only by default during design
- **Export validation** — block export if hard-coded credentials detected

## Deployment (builder itself)

| Environment | Client | Server |
|-------------|--------|--------|
| Local dev | `ng serve` | `nest start --watch` |
| Staging/prod | Static hosting or SSR | Node container |

Exact hosting TBD; not blocking initial development.

## Related documents

- [Component Model](./03-component-model.md)
- [Export Pipeline](./04-export-pipeline.md)
- [Technology Stack](./06-technology-stack.md)
