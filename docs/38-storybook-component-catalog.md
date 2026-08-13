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

## Sidebar taxonomy (web-components)

Primary navigation:

1. **Getting Started** — intro + component index with deep links
2. **Catalog / Palette** — one story per builder group + All components scroll
3. **Catalog / Meta compositions** — dashboard recipes (diagram + live preview + XML)

Legacy atom story groups (Layout, Visual, Recipes, Wasm) were removed from **web-components** in DAS-110 — coverage lives in Palette, Meta compositions, and **NPM layout atoms (rd-*)**.

Per-framework Storybook apps (React, Vue, Angular, Svelte) ship today on ports 6007–6010 per DAS-98; sidebar alignment with this taxonomy is tracked in **[DAS-112](https://planetkevin.atlassian.net/browse/DAS-112)** (implementation in follow-up branches).

## Story quality bar (DAS-101)

**Primary entry:** `Catalog → Palette` — one story per builder palette group (~50 component types) plus **All components (full scroll)**.

Each palette page shows every component in that group with:

- Builder-parity preview markup (same visual language as the dashboard preview panel)
- Interactive wiring where it matters (table → detail, news results → article, tabs, timers, Three.js VR/3D hosts)
- Shipped npm `<rd-*>` elements embedded for media + wasm rows

Atom-level npm custom element deep dives previously lived under Layout / Visual / Wasm; that coverage now lives in **Catalog / Palette**, **Meta compositions**, and **NPM layout atoms (rd-*)** (DAS-110).

Shared fixtures: `tools/storybook-shared/fixtures.ts` · catalog engine: `tools/storybook-shared/palette-catalog/`.

**Catalog meta compositions (DAS-105):** **Catalog → Meta compositions** — ~10 live dashboard/recipe layouts showing every palette component and npm `rd-*` atom **in action** together. Replaces markup-only **Meta elements** stories. See [Storybook meta compositions](./42-storybook-meta-compositions.md).

**Catalog meta custom elements (DAS-102):** `@rosettadash/web-components/catalog` registers `rd-palette-catalog`, `rd-palette-group`, `rd-component-spec`, `rd-component-port`, `rd-component-requirement`, and `rd-component-option`. Use `variant="default|compact|plain"` for density/chrome; BEM classes match future React/Vue wrappers. Storybook palette pages mount these CEs for per-component spec cards.

## Styling

Preview loads opt-in RosettaDash chrome globally:

- `packages/web-components/src/styles/tokens.css` (`--rd-*` tokens)
- `packages/web-components/src/styles/styles.css` (`.rd-*` classes)

Shared via `tools/storybook-shared/rosettadash-preview.css`.

## Shared fixtures

Demo link items and JSON for web-component attributes live in `tools/storybook-shared/fixtures.ts`.

## Implementation notes

- Storybook **10.5** with Vite builders (`@storybook/*-vite`, `@storybook/angular-vite` for Angular 22).
- Stories import from workspace path aliases in `tsconfig.base.json` (same paths as consumers).
- Framework media components register underlying web components on mount.

## References

- [Component taxonomy](./08-component-taxonomy.md)
- [Styling and classnames](./35-styling-and-classnames.md)
- [npm library build](./37-npm-library-build.md)
