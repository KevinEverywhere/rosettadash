# `@rosettadash/web-components`

Default RosettaDash UI runtime (Web Components).

**Author:** Kevin Ready \<kevin@planetkevin.com\>

## Install

```bash
npm install @rosettadash/web-components
```

> Unscoped [`rosettadash`](https://www.npmjs.com/package/rosettadash) is the **product monorepo**, not this package. See [consumer install](../../docs/39-npm-consumer-install.md).

## Import shape

```ts
import {
  registerRdAccordion,
  type AccordionProps,
} from '@rosettadash/web-components/layout/accordion';

registerRdAccordion();
```

```html
<rd-accordion title="Resources"></rd-accordion>
```

### Recipes (DAS-94)

```ts
import { registerRdLinkList } from '@rosettadash/web-components/visual/link-list';
import {
  registerRdAccordionLinkList,
  AccordionLinkList,
} from '@rosettadash/web-components/layout/accordion-link-list';

registerRdLinkList();
registerRdAccordionLinkList();

AccordionLinkList({
  title: 'Resources',
  items: [{ label: 'Docs', href: '/docs' }],
});
```

```html
<!-- Composition -->
<rd-accordion title="Resources">
  <rd-link-list items='[{"label":"Docs","href":"/docs"}]'></rd-link-list>
</rd-accordion>

<!-- Or the recipe helper element -->
<rd-accordion-link-list
  title="Resources"
  items='[{"label":"Docs","href":"/docs"}]'
></rd-accordion-link-list>
```

### Media (ffmp3Console / DAS-83)

```ts
import { registerRosettaDashMediaElements } from '@rosettadash/web-components/media';

registerRosettaDashMediaElements();
```

```html
<rd-video-source></rd-video-source>
<rd-equirect-viewport preview-mode="rectilinear" yaw="0" pitch="0" horizontal-fov="90"></rd-equirect-viewport>
```

Events: `video-file`, `crop-region`. Filter math: `@rosettadash/core` (`buildEquirectExtractFilter`).

Same `<group>/…/<component>` paths are used on `@rosettadash/react`, `@rosettadash/angular`, `@rosettadash/vue`, and `@rosettadash/svelte`.

## Styles (opt-in)

```ts
import '@rosettadash/web-components/tokens.css';
import '@rosettadash/web-components/styles.css';
```

Tokens use the `--rd-*` prefix. Components work without these imports (minimal defaults in shadow CSS).

## Build / pack

```bash
nx build web-components
npm pack ./dist/packages/web-components --dry-run
```
