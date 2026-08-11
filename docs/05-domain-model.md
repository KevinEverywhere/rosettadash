# Domain Model

RosettaDash models the **business context** dashboards operate in—not just UI widgets. This domain layer informs filters, defaults, role visibility, and exported data scoping.

## Core entities

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────►│ Project  │────►│ Dataset  │
└──────────┘     └──────────┘     └──────────┘
      │                │                 │
      │                │                 ▼
      │                │           ┌──────────┐
      │                └──────────►│ Widgets  │
      │                            └──────────┘
      ▼
┌──────────┐     ┌──────────┐
│  Person  │────►│   Role   │
└──────────┘     └──────────┘
```

### Client (tenant / account)

Represents an organizational boundary. Multi-client dashboards scope all data and navigation by client.

| Field | Description |
|-------|-------------|
| `id` | Unique identifier |
| `name` | Display name |
| `slug` | URL-safe key |

### Project

Work unit within a client—initiative, workspace, or app area.

| Field | Description |
|-------|-------------|
| `id` | Unique identifier |
| `clientId` | Parent client |
| `name` | Display name |
| `status` | active, archived, etc. |

### Person

A user who accesses the dashboard.

| Field | Description |
|-------|-------------|
| `id` | Unique identifier |
| `email` | Login / contact |
| `displayName` | UI label |

### Role

Capability bundle assigned to persons.

| Role (examples) | Typical permissions |
|-----------------|---------------------|
| `viewer` | Read dashboards, export reports |
| `editor` | Modify data, use forms |
| `admin` | Manage persons, roles, settings |
| `owner` | Full client/project control |

Roles map to exported **route guards**, **conditional visibility bindings**, and **API authorization stubs**.

### Time context

Dashboards are inherently time-oriented:

| Concept | Usage |
|---------|-------|
| `TimeRange` | start, end, preset (last 7 days, QTD, custom) |
| `ComparisonRange` | prior period for delta KPIs |
| `Timezone` | display and query normalization |
| `Granularity` | hour, day, week, month for charts |

Time context is typically driven by a **DateRangeFilter** component and propagated via bindings to tables and charts.

### Dataset

Logical data source view—not necessarily 1:1 with a DB table.

| Field | Description |
|-------|-------------|
| `id` | Identifier |
| `name` | Label in builder |
| `schema` | Column definitions |
| `sourceNodeId` | Link to DatabaseNode in composite |
| `defaultFilters` | client, project, time scoping |

## Domain-aware component behavior

### Scoping

When a composite includes domain context, exporters inject default query filters:

```sql
-- conceptual generated query
SELECT * FROM orders
WHERE client_id = :clientId
  AND project_id = :projectId
  AND created_at BETWEEN :rangeStart AND :rangeEnd
```

### Role-based UI

Components may declare `visibilityRoles: Role[]`. The defaults engine suggests hiding admin panels from viewers.

### Onboarding flows

**Onboarding** is modeled as a composite template type:

1. Invite person (form component)
2. Assign role (select component)
3. Confirm access (summary + submit)

Export includes server endpoints for invite/create/update role per chosen server partner.

## Historical vs live data

| Mode | Behavior |
|------|----------|
| **Live** | Query current data with optional refresh interval |
| **Historical snapshot** | Point-in-time or archived dataset |
| **Comparison** | Side-by-side or overlay in charts |

Toggle components bind to dataset query parameters (`asOf`, `includeArchived`).

## DomainContext in composite

```typescript
interface DomainContext {
  client?: { id: string; name: string };
  project?: { id: string; name: string };
  defaultTimeRange?: TimeRangePreset;
  roles?: RoleDefinition[];
  persons?: PersonDefinition[];   // for preview/mock
}
```

Used during:

- Builder preview (mock data generation)
- Smart defaults (role-aware layouts)
- Export (scoped queries, guards)

## Preview mock data

NestJS preview module generates realistic mock rows respecting:

- Client/project IDs in context
- Time range selection
- Column types from dataset schema

## Future extensions

- Audit log entity (who changed what, when)
- Notification preferences per person
- Custom role definitions beyond presets
- SSO provider mapping

## Related documents

- [Vision & Product Overview](./01-vision-and-product-overview.md)
- [Component Model](./03-component-model.md)
- [Component Taxonomy](./08-component-taxonomy.md)
