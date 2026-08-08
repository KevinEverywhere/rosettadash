# Workflow & Branching

## Jira

- **Project:** [DAS — Dashbuilder](https://planetkevin.atlassian.net/jira/software/projects/DAS/boards/68/backlog)
- **Board:** [Backlog / Board 68](https://planetkevin.atlassian.net/jira/software/projects/DAS/boards/68/backlog)

All work is tracked in Jira before implementation.

## Branching policy

**Feature branches only.** Never commit directly to `main` or `development`.

```
main ─────────────────────────────────────────────► (releases)
  │
  └── development ────────────────────────────────► (integration)
        │
        └── feature/DAS-123-short-description ───► (work)
```

### Branch naming

```
feature/DAS-<ticket-number>-<kebab-case-summary>
```

Examples:

- `feature/DAS-1-project-foundation`
- `feature/DAS-2-monorepo-scaffold`
- `feature/DAS-15-table-component-export`

### Workflow steps

1. **Create or select Jira ticket** — define scope and acceptance criteria.
2. **Create feature branch** from `main` (or `development` once it exists with content).
3. **Implement** on the feature branch.
4. **Open PR** targeting `development` (or `main` early on).
5. **Kevin commits and merges** — agents assist with messages and code; Kevin is sole committer/merger.

## Commit messages

Agents draft commit messages; Kevin performs commits.

### Format

```
<type>(DAS-<n>): <short summary>

<optional body — why, not just what>
```

### Types

| Type | Use |
|------|-----|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `chore` | Tooling, deps, config |
| `refactor` | Code change without behavior change |
| `test` | Tests |

### Example

```
docs(DAS-1): add project foundation and architecture docs

Establish vision, architecture, component model, export pipeline,
domain model, and workflow conventions for DashBuilder.
```

## Pull requests

- Title: `[DAS-n] Summary matching Jira ticket`
- Body: link Jira ticket, summary, test plan
- One ticket per PR preferred; large epics may span multiple PRs with clear ordering

## Agent responsibilities

| Agent | Human (Kevin) |
|-------|---------------|
| Draft code and docs | Commit and push |
| Propose commit messages | Approve/edit and commit |
| Create Jira tickets (when asked) | Prioritize backlog |
| Create feature branches | Merge PRs |
| Run tests locally | Final review |

## Repository notes

- **GitHub:** `https://github.com/KevinEverywhere/dashbuilder.git`
- **Current ticket:** [DAS-1](https://planetkevin.atlassian.net/browse/DAS-1)
- **Current branch:** `feature/DAS-1-project-foundation`

## Related documents

- [Roadmap](./10-roadmap.md)
