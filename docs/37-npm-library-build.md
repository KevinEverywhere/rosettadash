# npm library build (DAS-91)

**Ticket:** [DAS-91](https://planetkevin.atlassian.net/browse/DAS-91)  
**Branch:** `feature/DAS-91-npm-library-build-exports`

Implements publishable runtime packages with identical import paths:

```ts
import { … } from '@rosettadash/<runtime>/<group>/…/<component>';
```

## Packages

| npm name | Nx project | Role |
|----------|------------|------|
| `@rosettadash/web-components` | `web-components` | Default runtime (custom elements) |
| `@rosettadash/react` | `runtime-react` | React adapter package |
| `@rosettadash/angular` | `runtime-angular` | Angular adapter package |
| `@rosettadash/vue` | `runtime-vue` | Vue adapter package |
| `@rosettadash/svelte` | `runtime-svelte` | Svelte adapter package |

Unscoped root `rosettadash` remains the product/clone workspace (`private: true`) — not a component barrel. Author on publishable packages: `Kevin Ready <kevin@planetkevin.com>`. Consumer install / ffmp3 dogfood: [DAS-99](https://planetkevin.atlassian.net/browse/DAS-99) / [docs/39](./39-npm-consumer-install.md).

## Pilot + recipe exports

`layout/accordion` is exported from every runtime package:

- WC: `RdAccordionElement` / `<rd-accordion>` + `registerRdAccordion()`
- Other runtimes: real framework components (recipes + media WC hosts)

DAS-94 recipes (same subpaths on every runtime):

| Import | WC | Vue / React | Angular | Svelte |
|--------|----|-------------|---------|--------|
| `layout/accordion` | `<rd-accordion>` | Real components (`v-model:open` / controlled) | Standalone `rd-accordion` | `.svelte` + `bind:open` |
| `visual/link-list` | `<rd-link-list>` | Real `LinkList` | Standalone `rd-link-list` | `.svelte` source |
| `layout/accordion-link-list` | `<rd-accordion-link-list>` | Real recipe | Standalone recipe | `.svelte` recipe |
| `visual/media/video-source` | `<rd-video-source>` | WC wrapper | WC wrapper | WC wrapper (selector) | `.svelte` WC wrapper |
| `visual/media/equirect-viewport` | `<rd-equirect-viewport>` | WC wrapper | WC wrapper | WC wrapper (selector) | `.svelte` WC wrapper |

Legacy media subpaths (`./media`, `./wasm`) remain on `@rosettadash/web-components` for FFMP3; taxonomy-aligned aliases also exist under `./visual/media/…`.

## Build / pack

```bash
nx build web-components
npm pack ./dist/packages/web-components --dry-run

nx run-many -t build -p web-components,runtime-react,runtime-angular,runtime-vue,runtime-svelte
```

Built artifacts land in `dist/packages/<name>` with `.js` + `.d.ts`. Pack **from** `dist/packages/…`, not from `packages/…` source trees.

## Styles (DAS-92)

Packaged from `@rosettadash/web-components` (see [doc 35](./35-styling-and-classnames.md)):

```ts
import '@rosettadash/web-components/tokens.css';
import '@rosettadash/web-components/styles.css';
```

Dist layout after `nx build web-components`:

- `styles/tokens.css` → export `./tokens.css`
- `styles/styles.css` → export `./styles.css`

Public CSS contract is `--rd-*` / `rd-*` only (no `--db-*`).

## Follow-ons

- DAS-92 — public `--rd-*` / `rd-*` stylesheet packaging (**done**)
- DAS-94 — recipe helpers (**in progress** on `feature/DAS-94-npm-recipe-helpers`)
- DAS-93 — full taxonomy @ **0.1.1** on react/angular/vue/svelte (**done** via DAS-116–119); npm publish gate on `feature/DAS-93-runtime-taxonomy-0-1-1-gate`
- DAS-96 — shared kernel to remove adapter stub duplication
- DAS-120 — consumer proof apps (five Nx apps under `apps/`, group tabs)
