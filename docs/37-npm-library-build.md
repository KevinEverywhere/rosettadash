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

Unscoped root `rosettadash` remains the product/clone workspace (`private: true`) — not a component barrel.

## Pilot export

`layout/accordion` is exported from every runtime package:

- WC: `RdAccordionElement` / `<rd-accordion>` + `registerRdAccordion()`
- Other runtimes: thin adapter stubs sharing `AccordionProps` (richer DOM adapters follow in later tickets)

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

- DAS-92 — public `--rd-*` / `rd-*` stylesheet packaging (**ready to merge** on `feature/DAS-92-rd-tokens-styles`)
- DAS-93 — full taxonomy coverage for `0.1.0`
- DAS-94 — recipe helpers
- DAS-96 — shared kernel to remove adapter stub duplication
