# `@rosettadash/react`

RosettaDash **React** runtime. Import paths match `@rosettadash/web-components`.

Peer dependency: `react` >= 18 (`react-dom` recommended for apps).

**Docs:** [React runtime integration](../../docs/40-react-runtime-integration.md) · [Stack styling guides](../../docs/41-stack-styling-guides.md)

## Styling modes

| Mode | Import |
|------|--------|
| Minimal | (none) — structure + `rd-*` classnames |
| Tokens | `@rosettadash/web-components/tokens.css` |
| Themed default | `@rosettadash/web-components/styles.css` |

Native React components (accordion, link-list) inherit your stack CSS. CE hosts (media, wasm) accept `className` / `style` and `--rd-*` variables on the host.

## Storybook

Clone the [RosettaDash repo](https://github.com/KevinEverywhere/rosettadash) and run `npm run storybook:react` (port **6007**). Same sidebar as the web-components catalog: **Getting Started → Styling modes**, **Catalog / Components**, **Catalog / Meta components**. See [GitHub — Storybook](https://github.com/KevinEverywhere/rosettadash#component-examples-storybook).

## Accordion

```tsx
import { useState } from 'react';
import { Accordion } from '@rosettadash/react/layout/accordion';

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <Accordion title="Resources" open={open} onOpenChange={setOpen}>
      <p>Panel body</p>
    </Accordion>
  );
}
```

Panel content stays mounted when closed; pair with `styles.css` or your own `.rd-accordion__panel { display: none }` rules.

## Recipes

```tsx
import { LinkList } from '@rosettadash/react/visual/link-list';
import { AccordionLinkList } from '@rosettadash/react/layout/accordion-link-list';

const items = [
  { label: 'Docs', href: '/docs' },
  { label: 'API', href: '/api' },
];

export function ResourcesNav() {
  return (
    <>
      <Accordion title="Resources">
        <LinkList items={items} />
      </Accordion>
      <AccordionLinkList title="Resources" items={items} />
    </>
  );
}
```

## Media & WASM wrappers

```tsx
import { VideoSource } from '@rosettadash/react/visual/media/video-source';
import { EquirectViewport } from '@rosettadash/react/visual/media/equirect-viewport';
import { WasmMedia } from '@rosettadash/react/wasm/wasm-media';
```

Thin hosts over the WC runtime (same paths as `@rosettadash/web-components`). All components support `forwardRef`.
