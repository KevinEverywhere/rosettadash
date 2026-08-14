# Public component API

**Ticket:** [DAS-90](https://planetkevin.atlassian.net/browse/DAS-90)  
**Companion:** [npm package prep](./33-npm-package-prep.md), [Post–DAS-90 plan](./36-npm-post-90-plan.md), [Styling](./35-styling-and-classnames.md)

## Product vs library

| Want | Do |
|------|----|
| Run / contribute to the builder | `git clone` **rosettadash** |
| Use components in an app | `npm install @rosettadash/<runtime>` then import with groups |

## Import shape (all runtimes)

```text
@rosettadash/<runtime>/<group>/…/<component>
```

- **`<runtime>`** — `web-components` (default), `react`, `angular`, `vue`, `svelte`, …
- **`<group>/…`** — **one or more** group segments (taxonomy path)
- **`<component>`** — atom or recipe name (kebab-case)

**Same path after the runtime** for every framework package.

```ts
import { Accordion } from '@rosettadash/web-components/layout/accordion';
import { Accordion } from '@rosettadash/react/layout/accordion';
import { Accordion } from '@rosettadash/angular/layout/accordion';
import { Accordion } from '@rosettadash/vue/layout/accordion';
import { Accordion } from '@rosettadash/svelte/layout/accordion';

import { LinkList } from '@rosettadash/react/visual/link-list';
import { VideoSource } from '@rosettadash/web-components/visual/media/video-source';
```

No `@rosettadash/vendor/…` path.

## Naming

| Layer | Convention | Example |
|-------|------------|---------|
| Install | `@rosettadash/<runtime>` | `@rosettadash/react` |
| Import | `@rosettadash/<runtime>/<group>/…/<component>` | `@rosettadash/react/layout/accordion` |
| Nested groups | additional segments | `@rosettadash/react/visual/media/video-source` |
| Taxonomy type | dotted | `layout.accordion`, `visual.media.video-source` |
| Export symbol | PascalCase | `Accordion` |
| Custom element | `rd-` + kebab | `rd-accordion` |
| CSS root block | `rd-` + kebab (taxonomy-aligned) | `rd-accordion`, `rd-input-text`, `rd-chart-line` |
| CSS element | `rd-<block>__<element>` | `rd-accordion__panel` |
| CSS modifier | `rd-<block>--<modifier>` | `rd-accordion--open` |
| CSS tokens | `--rd-*` | `--rd-color-accent` |
| Recipe helper | same shape | `@rosettadash/react/layout/accordion-link-list` |

**BEM normalization (DAS-93):** Every runtime component root uses a taxonomy-aligned block class derived from the palette type (same rule as WC `taxonomyToRdTag`: strip top-level category prefix, dots → hyphens, prefix `rd-`). Elements/modifiers use that block (`rd-kpi__value`, not `rd-atom--kpi-card`). `data-testid` equals the root block class. No generic `rd-atom` wrappers.

## Recipes over atoms

No `composite.*` registry types for npm. Prefer composition; ship a **small** helper set under the same path rules.

```html
<rd-accordion title="Resources">
  <rd-link-list></rd-link-list>
</rd-accordion>
```

```tsx
import { Accordion } from '@rosettadash/react/layout/accordion';
import { LinkList } from '@rosettadash/react/visual/link-list';

export function ResourcesNav({ items }) {
  return (
    <Accordion title="Resources" defaultOpen={false}>
      <LinkList items={items} />
    </Accordion>
  );
}
```

```ts
import {
  AccordionLinkList,
  type AccordionLinkListProps,
} from '@rosettadash/react/layout/accordion-link-list';
```

### Initial recipe set (DAS-94)

| Import (any runtime) | Intent | Status |
|----------------------|--------|--------|
| `…/visual/link-list` | List of `{ label, href }` | Real components on WC / Vue / React / Angular / Svelte |
| `…/layout/accordion-link-list` | Collapsible nav / TOC | Real recipes on WC / Vue / React / Angular / Svelte |

## Typing contract

Every public export: component + `Props` / item types, documented defaults, no public `any`, shipped `.d.ts`.

## v1 / `0.1.0` gate

1. All taxonomy atoms on **every** runtime package with identical `<group>/…/<component>` subpaths  
2. Typing + opt-in `--rd-*` styles  
3. Initial recipes documented  

## Related

- [npm package prep](./33-npm-package-prep.md)  
- [Post–DAS-90 plan](./36-npm-post-90-plan.md)  
- [Styling and classnames](./35-styling-and-classnames.md)  
