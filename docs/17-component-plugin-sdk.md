# Component Plugin SDK

Guide for registering **new component types** with the DashBuilder graph, palette, and preview runtime.

**Prerequisite for:** three.js visuals (DAS-56), third-party palette plugins.

**Related:** [Component Model](./03-component-model.md) · [Exporter Plugin SDK](./16-exporter-plugin-sdk.md) · [Local Development & Components](./13-local-development-and-components.md)

---

## Overview

DashBuilder components flow through four layers:

```
ComponentPlugin (core)  →  registry + palette group
       ↓
Preview adapter (client) →  live preview renderer
       ↓
Export IR (core)         →  validated snapshot
       ↓
Exporter plugin        →  target-framework source
```

The **component plugin SDK** formalizes the first two layers. The exporter SDK (DAS-54) handles code generation.

---

## Plugin contract (core)

Types live in `packages/core/src/lib/registry/component-plugin.ts`:

| Type | Purpose |
|------|---------|
| `ComponentPlugin` | `{ id, definition, metadata }` |
| `ComponentPluginMetadata` | `{ paletteGroupId, previewKind }` |
| `ComponentPreviewKind` | `'builtin' \| 'plugin' \| 'infra'` |

Register on the shared registry:

```typescript
import { ComponentRegistry, type ComponentPlugin } from '@dashbuilder/core';

const plugin: ComponentPlugin = {
  id: 'plugin.my-widget',
  definition: {
    type: 'visual.plugin.my-widget',
    category: 'visual',
    label: 'My Widget',
    isVisual: true,
    inputs: [],
    outputs: [{ id: 'value', name: 'value', dataType: 'string' }],
    properties: [
      { key: 'label', label: 'Label', type: 'string', default: 'Hello' },
    ],
  },
  metadata: {
    paletteGroupId: 'plugin-extensions',
    previewKind: 'plugin',
  },
};

registry.registerPlugin(plugin);
```

`registerPlugin`:

1. Adds the `ComponentDefinition` to the registry (same as `register()`)
2. Stores plugin metadata for palette/preview routing
3. Throws if the type is already registered

Built-in P0 components are described by `createBuiltInComponentPlugins()` / `builtInComponentPluginDescriptors`. Extension demos ship in `EXTENSION_COMPONENT_PLUGINS`.

---

## Palette integration

Every registered type must appear in exactly one palette group (`PALETTE_GROUP_DEFINITIONS`):

1. Add your type to an existing group (keep **2–7 items** per group), **or**
2. Add a new group (also 2–7 items)

`validatePaletteGroupDefinitions()` checks coverage against `defaultComponentRegistry.list()` — including plugin types registered at startup.

Example extension group (shipped in DAS-55):

| Type | Label |
|------|-------|
| `visual.plugin.status-badge` | Status Badge |
| `visual.plugin.metric-chip` | Metric Chip |

---

## Preview adapter (client)

Built-in visuals use the large `@switch` in `preview-node.component.html`. **Plugin types** use the preview adapter registry:

```typescript
// component-preview-adapter.registry.ts
registry.register('visual.plugin.status-badge', 'status-badge');
```

At app startup (`app.config.ts`):

```typescript
provideAppInitializer(() => {
  registerDefaultComponentPreviewAdapters(inject(ComponentPreviewAdapterRegistry));
});
```

`PreviewNodeComponent` checks the registry in its `@default` branch and renders `PreviewPluginComponent` when a template is registered.

### Adding a new preview template

1. Add a template id to `ComponentPreviewTemplateId`
2. Implement markup in `preview-plugin.component.html`
3. Register `type → templateId` in `registerDefaultComponentPreviewAdapters` (or your own bootstrap)

For heavy runtimes (WebGL / three.js), the adapter will likely mount a dedicated Angular component with lifecycle hooks (`ngOnDestroy` for renderer disposal).

---

## Example: extension plugins (DAS-55)

Shipped demo plugins prove the SDK without three.js yet:

| Type | Preview | Palette group |
|------|---------|---------------|
| `visual.plugin.status-badge` | Colored status pill | `plugin-extensions` |
| `visual.plugin.metric-chip` | Inline metric chip | `plugin-extensions` |

Registered in `extension-component-plugins.ts` and loaded when `defaultComponentRegistry` initializes.

---

## Export path

Plugin components participate in export like any other type:

1. Add exporter templates in each UI target (or start with React only)
2. Optionally extend `builtInExporterManifest` metadata
3. Run export matrix tests

Until exporter templates exist, export may emit fallback stubs — plan exporter work alongside preview for new plugin types.

---

## three.js readiness (DAS-56)

Shipped in DAS-56:

| Type | Preview | Palette group |
|------|---------|---------------|
| `visual.display.3d-bar-chart` | three.js bars + orbit | `vr-visuals` |
| `visual.display.3d-scatter` | three.js scatter (preview) | `vr-visuals` |
| `visual.display.3d-scene` | three.js orbit scene + rowset point cloud | `vr-visuals` |

Recommended patterns for future VR plugins:

| Layer | Approach |
|-------|----------|
| **Definition** | Properties: camera, background, animation; ports: `rowset` → mesh data |
| **Preview** | Dedicated component registered via adapter; shared `ThreePreviewRuntime` lifecycle |
| **Lifecycle** | Create/dispose renderer on node id change; pause when not in preview mode |
| **Performance** | Reuse DAS-53 viewport/culling patterns; single animation loop per panel |
| **Export** | React (R3F), Vue (TresJS), Svelte (Threlte), Angular (three.js canvas) for VR visuals |

The component SDK is the hook point — three.js should not be special-cased in core.

---

## Checklist — new component plugin

- [ ] Jira ticket + `feature/DAS-n-*` branch
- [ ] `ComponentPlugin` with validated definition + metadata
- [ ] `registry.registerPlugin()` (or startup registration)
- [ ] Palette group assignment (2–7 items)
- [ ] Client preview adapter + template
- [ ] Grouping guide (optional)
- [ ] Exporter templates (minimum one UI target)
- [ ] Unit tests (registry + palette validation)
- [ ] E2e: add from palette → preview visible
- [ ] `npm run verify`

---

## Related documents

- [Exporter Plugin SDK](./16-exporter-plugin-sdk.md)
- [Component & Page Design](./15-component-and-page-design.md)
- [Component Taxonomy](./08-component-taxonomy.md)
