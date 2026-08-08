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
npm run start:client   # Angular only (proxies /api → :3000)
npm run start:server   # NestJS only (default http://localhost:3000/api)
```

Health check: `GET http://localhost:3000/api/health`

### Projects API (in-memory, single-user MVP)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create project `{ "name": "..." }` |
| GET | `/api/projects/:id` | Get project with composites |
| PATCH | `/api/projects/:id` | Update project metadata |
| DELETE | `/api/projects/:id` | Delete project |
| GET | `/api/projects/:id/composites` | List composites |
| POST | `/api/projects/:id/composites` | Create composite (validated) |
| PUT | `/api/projects/:id/composites/:cid` | Update composite (validated, version++) |
| DELETE | `/api/projects/:id/composites/:cid` | Delete composite |

Invalid composites return `400` with `{ message, issues }`.

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

**[DAS-6](https://planetkevin.atlassian.net/browse/DAS-6)** — Canvas persistence  
Branch: `feature/DAS-6-canvas-persistence`

## License

MIT
