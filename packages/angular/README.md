# `@rosettadash/angular`

RosettaDash **Angular** runtime (standalone components). Import paths match `@rosettadash/web-components`.

Peer dependencies: `@angular/core`, `@angular/common` >= 18.

## Accordion (`[(open)]`)

```ts
import { Accordion } from '@rosettadash/angular/layout/accordion';
```

```html
<rd-accordion title="Resources" [(open)]="open">
  <p>Panel body</p>
</rd-accordion>
```

## Recipes (DAS-94)

```ts
import { LinkList } from '@rosettadash/angular/visual/link-list';
import { AccordionLinkList } from '@rosettadash/angular/layout/accordion-link-list';
```

```html
<rd-accordion title="Resources">
  <rd-link-list [items]="items" />
</rd-accordion>

<rd-accordion-link-list title="Resources" [items]="items" />
```

Pair with `@rosettadash/web-components/styles.css` for opt-in `--rd-*` chrome.
