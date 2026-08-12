# `@rosettadash/web-components`

Default RosettaDash UI runtime (Web Components).

## Install

```bash
npm install @rosettadash/web-components
```

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

Same `<group>/…/<component>` paths are used on `@rosettadash/react`, `@rosettadash/angular`, `@rosettadash/vue`, and `@rosettadash/svelte`.

## Build / pack

```bash
nx build web-components
npm pack ./dist/packages/web-components --dry-run
```
