# Storybook component catalogs (DAS-98)

Per-runtime Storybook apps for visual review and experimentation with RosettaDash npm library components.

## Apps

| Nx project | Runtime | Port | Command |
|------------|---------|------|---------|
| `storybook-web-components` | `@rosettadash/web-components` (default) | 6006 | `npm run storybook:web-components` |
| `storybook-react` | `@rosettadash/react` | 6007 | `npm run storybook:react` |
| `storybook-vue` | `@rosettadash/vue` | 6008 | `npm run storybook:vue` |
| `storybook-angular` | `@rosettadash/angular` | 6009 | `npm run storybook:angular` |
| `storybook-svelte` | `@rosettadash/svelte` | 6010 | `npm run storybook:svelte` |

Run all five in parallel (each on its own port):

```bash
npm run storybook:all
```

Build static catalogs:

```bash
npm run build-storybook
```

Output: `dist/storybook/<project>/`.

Default canvas route when no story is in the URL: **Getting Started → Start here** (`getting-started--start-here`).

## Sidebar taxonomy (all five catalogs)

Every runtime Storybook shares the same sidebar (DAS-112):

1. **Getting Started**
   - **Start here** — catalog map, builder templates, deep links
   - **Component count** — full index with navigation to Components and Meta components
   - **Styling modes** — side-by-side minimal / tokens / themed comparison (all runtimes; stack-specific copy)
2. **Catalog / Components** — one story per builder group + **All components (full scroll)** + **NPM layout atoms (rd-*)**
3. **Catalog / Meta components** — dashboard recipes (diagram + live preview + component XML) with **Controls**, **Actions**, and **Interactions** on real in-context demos (DAS-114)

Legacy atom story groups (Layout, Visual, Recipes, Wasm) were removed in DAS-110 — coverage lives in **Components**, **Meta components**, and **NPM layout atoms (rd-*)**.

Manager header branding: **RosettaDash · {runtime} catalog** (e.g. React catalog on port 6007).

## Story quality bar (DAS-101)

**Primary entry:** `Catalog → Components` — one story per builder group (~50 component types) plus **All components (full scroll)**.

Each Components page shows every type in that group with:

- Builder-parity preview markup (same visual language as the dashboard preview panel)
- Interactive wiring where it matters (table → detail, news results → article, tabs, timers, Three.js VR/3D hosts)
- Shipped npm `<rd-*>` elements embedded for media + wasm rows

Atom-level npm custom element deep dives previously lived under Layout / Visual / Wasm; that coverage now lives in **Catalog / Components**, **Meta components**, and **NPM layout atoms (rd-*)** (DAS-110).

Shared fixtures: `tools/storybook-shared/fixtures.ts` · catalog engine: `tools/storybook-shared/palette-catalog/`.

**Catalog meta components (DAS-105):** **Catalog → Meta components** — ~10 live dashboard/recipe layouts showing every builder component and npm `rd-*` atom **in action** together. Replaces markup-only **Meta elements** stories. See [Storybook meta components](./42-storybook-meta-compositions.md).

**Catalog meta custom elements (DAS-102):** `@rosettadash/web-components/catalog` registers `rd-palette-catalog`, `rd-palette-group`, `rd-component-spec`, `rd-component-port`, `rd-component-requirement`, and `rd-component-option`. Use `variant="default|compact|plain"` for density/chrome; BEM classes match future React/Vue wrappers. Storybook Components pages mount these CEs for per-component spec cards.

## Styling

Preview loads opt-in RosettaDash chrome globally:

- `packages/web-components/src/styles/tokens.css` (`--rd-*` tokens)
- `packages/web-components/src/styles/styles.css` (`.rd-*` classes)

Shared via `tools/storybook-shared/rosettadash-preview.css`.

**Getting Started → Styling modes** (`tools/storybook-shared/styling-modes/`) explains minimal vs tokens vs themed imports and how each runtime fits Tailwind, plain CSS, CSS Modules, MUI, etc. See [Stack styling guides](./41-stack-styling-guides.md).

## Shared fixtures

Demo link items and JSON for web-component attributes live in `tools/storybook-shared/fixtures.ts`.

## Implementation notes

- Storybook **10.5** with Vite builders (`@storybook/*-vite`, `@storybook/angular-vite` for Angular 22).
- `storySort` must be defined **inline** in each app’s `.storybook/preview.ts` (Storybook 10 ignores imported sort config).
- Framework catalog stories reuse shared DOM mounts via `tools/storybook-shared/dom-story-host.*`.
- Stories import from workspace path aliases in `tsconfig.base.json` (same paths as consumers).
- Framework media components register underlying web components on mount.

## References

- [Component taxonomy](./08-component-taxonomy.md)
- [Styling and classnames](./35-styling-and-classnames.md)
- [npm library build](./37-npm-library-build.md)
- [React runtime integration](./40-react-runtime-integration.md)
