# DashBuilder

DashBuilder is a visual dashboard component builder. Users design dashboard interfaces piecemeal—forms, tables, charts, drag-and-drop layouts, timing, animation, and more—then assemble them into composites and export working code for their target stack.

## Monorepo

This repository is an [Nx](https://nx.dev) workspace (free tier, no Nx Cloud required).

| Project | Path | Description |
|---------|------|-------------|
| `client` | `apps/client` | Angular builder UI |
| `server` | `apps/server` | NestJS API |
| `core` | `packages/core` | Shared types and utilities |

## Quick start

```bash
npm install
npm start              # client + server in parallel
npm run start:client   # Angular only (default http://localhost:4200)
npm run start:server   # NestJS only (default http://localhost:3000/api)
```

Health check: `GET http://localhost:3000/api/health`

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Serve client and server |
| `npm run build` | Build client, server, and core |
| `npm test` | Run unit tests |
| `npm run lint` | Lint all projects |

## Documentation

See [docs/README.md](docs/README.md) for the full documentation index.

## Workflow

1. Pick a Jira ticket in [DAS](https://planetkevin.atlassian.net/jira/software/projects/DAS/boards/68/backlog).
2. Branch from `development`: `feature/DAS-<n>-<description>`.
3. Open PR to `development`. Kevin commits and merges.

## Current ticket

**[DAS-5](https://planetkevin.atlassian.net/browse/DAS-5)** — Builder shell  
Branch: `feature/DAS-5-builder-shell`

Run the builder: `npm run start:client` → http://localhost:4200

## License

MIT
