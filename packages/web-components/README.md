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
