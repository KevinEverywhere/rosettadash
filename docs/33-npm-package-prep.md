# npm package prep (`rosettadash`)

**Ticket:** [DAS-90](https://planetkevin.atlassian.net/browse/DAS-90)  
**Status:** Docs / decisions only — no publish pipeline in this ticket.  
**Branch:** `feature/DAS-90-npm-package-prep`  
**Post-90 plan:** [Post–DAS-90 plan](./36-npm-post-90-plan.md)

**Agents never commit.**

## Decisions (locked)

| Topic | Decision |
|-------|----------|
| Unscoped **`rosettadash`** | Same as **git clone** — the product / monorepo. **Not** a component library install. |
| Reserve `rosetta-dash` | **No** |
| Component import shape | **`@rosettadash/<runtime>/<group>/…/<component>`** — **one or more** group segments, then the component. |
| Runtimes (same treatment) | **Every** published UI runtime uses that shape: `web-components`, `react`, `angular`, `vue`, `svelte`, … |
| Default runtime | **`web-components`** |
| v1 / `0.1.0` | **All** taxonomy components on **all** runtime packages (same path after the runtime) |
| Composites | **Recipes over atoms** |
| Tokens | **`--rd-*`**, minimal opt-in CSS |
| Standalone export | Remains primary ([doc 32](./32-standalone-first-export.md)) |
| DAS-90 scope | **Documentation only** |

There is **no** `vendor` segment. The first scoped name is the **runtime**.

## Dual developer journeys

### A) Product = `rosettadash` (git clone)

```bash
git clone https://github.com/KevinEverywhere/rosettadash.git
cd rosettadash
npm install
npm run build
npm start
```

Do **not** use `npm install rosettadash` to get UI components.

### B) Components = scoped runtime packages

```bash
npm install @rosettadash/web-components   # default
npm install @rosettadash/react
npm install @rosettadash/angular
npm install @rosettadash/vue
npm install @rosettadash/svelte
```

```ts
// Default — Web Components (one group segment)
import { Accordion } from '@rosettadash/web-components/layout/accordion';

// Same groups/component on every runtime
import { Accordion } from '@rosettadash/react/layout/accordion';
import { Accordion } from '@rosettadash/angular/layout/accordion';
import { Accordion } from '@rosettadash/vue/layout/accordion';
import { Accordion } from '@rosettadash/svelte/layout/accordion';

// One or more group segments when taxonomy needs nesting
import { VideoSource } from '@rosettadash/web-components/visual/media/video-source';
```

Optional styles (entry finalized in DAS-92):

```ts
import '@rosettadash/web-components/styles.css';
```

## Package graph

| Artifact | Role |
|----------|------|
| Git product `rosettadash` | Clone / build builder |
| `@rosettadash/web-components` | Default CE package; `exports` `./<group>/…/<component>` |
| `@rosettadash/react` | React — **same** group/component subpaths |
| `@rosettadash/angular` | Angular — **same** subpaths |
| `@rosettadash/vue` | Vue — **same** subpaths |
| `@rosettadash/svelte` | Svelte — **same** subpaths |
| `@rosettadash/core`, `exporters-*`, `apps/*` | Internal / private |

## Planned `exports` (same map per runtime package)

```json
{
  "name": "@rosettadash/react",
  "exports": {
    "./layout/accordion": {
      "types": "./dist/layout/accordion/index.d.ts",
      "import": "./dist/layout/accordion/index.js"
    },
    "./visual/link-list": {
      "types": "./dist/visual/link-list/index.d.ts",
      "import": "./dist/visual/link-list/index.js"
    },
    "./visual/media/video-source": {
      "types": "./dist/visual/media/video-source/index.d.ts",
      "import": "./dist/visual/media/video-source/index.js"
    },
    "./styles.css": "./dist/styles.css",
    "./tokens.css": "./dist/tokens.css"
  }
}
```

`@rosettadash/web-components`, `@rosettadash/angular`, `@rosettadash/vue`, and `@rosettadash/svelte` expose the **identical** `./<group>/…/<component>` keys.

Groups follow taxonomy (e.g. `layout`, `visual`, `visual/media`). Component segment is kebab-case (`accordion`, `link-list`).

## Related

- [Post–DAS-90 plan](./36-npm-post-90-plan.md)
- [Public component API](./34-public-component-api.md)
- [Styling and classnames](./35-styling-and-classnames.md)
