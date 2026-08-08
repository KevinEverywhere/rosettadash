# DashBuilder

DashBuilder is a visual dashboard component builder. Users design dashboard interfaces piecemeal—forms, tables, charts, drag-and-drop layouts, timing, animation, and more—then assemble them into composites and export working code for their target stack.

## What it does

- **Build visually** — Drag components onto a canvas, configure properties, and connect them into composites.
- **Export anywhere** — Generate single components or full groups for React, Angular, Vue (extensible to more frameworks).
- **Choose your stack** — Select server partners (Next.js, Nuxt, NestJS, Express) and databases (MongoDB, PostgreSQL, Supabase, MySQL).
- **Ship working code** — Exports include styles, scripts, and wiring so components render and function in the browser.

## Repository structure (planned)

```
dashbuilder/
├── apps/
│   ├── client/          # Angular builder UI
│   └── server/          # NestJS API (creation-time backend)
├── packages/
│   ├── core/            # Shared types, component model, export engine
│   ├── exporters/       # Framework-specific code generators
│   └── ui-primitives/   # Builder palette components
├── docs/                # Architecture, vision, workflow
└── ...
```

## Documentation

| Document | Description |
|----------|-------------|
| [Vision & Product Overview](docs/01-vision-and-product-overview.md) | Goals, users, and core concepts |
| [Architecture](docs/02-architecture.md) | System design, client/server split, data flow |
| [Component Model](docs/03-component-model.md) | Atoms, composites, invisible infrastructure nodes |
| [Export Pipeline](docs/04-export-pipeline.md) | Code generation for frameworks, servers, databases |
| [Domain Model](docs/05-domain-model.md) | Dashboard domain: time, projects, clients, roles |
| [Technology Stack](docs/06-technology-stack.md) | Stack choices and rationale |
| [Workflow & Branching](docs/07-workflow-and-branching.md) | Jira tickets, feature branches, commit conventions |
| [Component Taxonomy](docs/08-component-taxonomy.md) | Palette categories and component inventory |
| [Glossary](docs/09-glossary.md) | Terms and definitions |
| [Roadmap](docs/10-roadmap.md) | Phased delivery plan |

## Workflow

1. Create or pick a Jira ticket in the [DAS project](https://planetkevin.atlassian.net/jira/software/projects/DAS/boards/68/backlog).
2. Create a feature branch: `feature/DAS-<number>-<short-description>`.
3. Implement on the feature branch only — never commit directly to `main` or `development`.
4. Open a PR when ready; Kevin commits and merges.

## Current ticket

**[DAS-1](https://planetkevin.atlassian.net/browse/DAS-1)** — Project foundation: architecture, vision, and contextual documentation  
Branch: `feature/DAS-1-project-foundation`

## License

TBD
