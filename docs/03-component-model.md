# Component Model

DashBuilder treats everything on the design surface as a **node** in a composite graph. Nodes are typed, have properties, expose ports for bindings, and participate in export.

## Node categories

### Visual components

Rendered in the browser. Examples: text input, select, data table, line chart, KPI card, modal, tabs, drag handle.

### Layout components

Structure other visual components: grid, flex row/column, stack, split pane, responsive breakpoint container.

### Logic components

Often non-visual or minimally visual: timer, debounce, conditional visibility, form validator, data transformer.

### Infrastructure components

Never rendered in the end-user UI. Generate config and server code:

| Type | Export artifact examples |
|------|--------------------------|
| `DatabaseNode` | Connection module, env template, migration stub |
| `ServerNode` | Route files, module registration, middleware |
| `EnvConfigNode` | `.env.example`, typed config accessor |
| `AuthProviderNode` (future) | Guard/middleware stubs |

## Node anatomy

```typescript
// Conceptual — implementation in packages/core

interface ComponentNode {
  id: string;
  type: string;                    // e.g. 'visual.table', 'infra.postgresql'
  label: string;
  properties: Record<string, unknown>;  // schema-validated
  ports: {
    inputs: Port[];
    outputs: Port[];
  };
  layout?: {                       // visual nodes only
    x: number;
    y: number;
    width: number;
    height: number;
  };
  meta: {
    frameworkHints?: Record<string, unknown>;
    suggestedBy?: 'user' | 'defaults-engine';
  };
}

interface Port {
  id: string;
  name: string;
  dataType: DataType;              // string, number, rowset, event, etc.
  required?: boolean;
}

interface Binding {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
}
```

## Composite

A **composite** is a persisted graph:

```typescript
interface Composite {
  id: string;
  name: string;
  description?: string;
  nodes: ComponentNode[];
  bindings: Binding[];
  exportTargets: ExportTargetConfig;
  domainContext?: DomainContext;   // see 05-domain-model.md
  version: number;
}
```

Composites can:

- Be exported as a whole (dashboard page)
- Export individual nodes as standalone components
- Be saved as reusable templates
- Nest references to other composites (by reference, not copy)

## Property schemas

Each component type defines a **JSON Schema** (or equivalent) for its properties. The inspector renders forms from these schemas.

Example — `visual.table`:

| Property | Type | Default | Notes |
|----------|------|---------|-------|
| `columns` | ColumnDef[] | inferred from data port | Smart default from binding |
| `pageSize` | number | 25 | Suggested when row count > 100 |
| `sortable` | boolean | true | |
| `filterable` | boolean | true | |
| `emptyMessage` | string | "No data" | |

## Bindings

Bindings connect ports:

```
[PostgreSQL Node] ──rowset──► [Table Node] ──row-select event──► [Detail Panel]
[Date Filter]     ──range────► [Chart Node]
[Role Guard]      ──visible───► [Admin Settings Panel]
```

Binding rules (validated before export):

- Port data types must be compatible (with explicit coercion nodes where allowed)
- Required inputs must be bound or have default values
- Infrastructure nodes must connect to at least one consumer unless marked optional
- No cycles in data-flow graph (event cycles allowed with explicit async markers)

## Piecemeal vs grouped export

| Mode | Behavior |
|------|----------|
| **Single component** | Export one node + minimal dependencies (styles, types, local utils) |
| **Selection** | Export selected nodes + bindings between them + required infra |
| **Full composite** | Export entire graph as a page/module with all wiring |

User chooses at export time. IR determines the closure of required nodes.

## Drag-and-drop assembly

Canvas interactions map to graph operations:

| User action | Graph mutation |
|-------------|----------------|
| Drag from palette | `addNode` |
| Drop into layout cell | `addNode` + `bind` parent layout port |
| Draw connection | `addBinding` |
| Group selection | Create `composite-ref` or layout wrapper |
| Delete | `removeNode` + cascade unbind |

## Smart defaults integration

When a node is added or a binding is created, the **defaults engine** may:

- Populate property values
- Suggest additional nodes ("Add pagination control?")
- Flag misconfigurations ("Chart expects time-series; bound field is categorical")

Suggestions appear as dismissible inspector hints; accepting applies property patches.

## Preview vs export

| Phase | Renderer |
|-------|----------|
| Builder preview | Generic renderer in `packages/ui-primitives` (approximates behavior) |
| Export | Framework-specific exporter produces real source |

Preview prioritizes fast feedback; export prioritizes idiomatic target-framework code.

## Versioning

Composite `version` increments on each save. Export records which version was used. Future: diff between versions for migration notes.

## Design guides

For practical checklists and page-level patterns (analytics overview, onboarding, role-scoped admin), see **[Component & Page Design](./15-component-and-page-design.md)**.

## Related documents

- [Export Pipeline](./04-export-pipeline.md)
- [Component Taxonomy](./08-component-taxonomy.md)
- [Domain Model](./05-domain-model.md)
- [Component & Page Design](./15-component-and-page-design.md)
