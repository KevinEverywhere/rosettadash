# React runtime integration

**Ticket:** [DAS-104](https://planetkevin.atlassian.net/browse/DAS-104)  
**Companion:** [Stack styling guides](./41-stack-styling-guides.md), [Styling and classnames](./35-styling-and-classnames.md), [Public component API](./34-public-component-api.md)

`@rosettadash/react` mirrors `@rosettadash/web-components` import paths. Each group/component lives at the same folder shape in both packages.

## Install

```bash
npm install @rosettadash/react @rosettadash/web-components react react-dom
```

Peer dependency: `react` >= 18. Custom-element hosts register their WC definitions on first render.

## Two integration patterns

| Pattern | Components | DOM | Styling |
|---------|------------|-----|---------|
| **Native React (light DOM)** | Accordion, LinkList, AccordionLinkList | Standard React elements with `rd-*` BEM classnames | Inherits parent CSS (Tailwind, MUI, plain CSS, CSS Modules) |
| **Custom-element host** | VideoSource, EquirectViewport, WasmMedia | `<rd-*>` shadow hosts | `className` / `style` on host; tune internals via `--rd-*` on host or wrapper |

Native React components match web-component behavior (panel always mounted; open state via `rd-accordion--open` + CSS). Import `@rosettadash/web-components/styles.css` when you want the packaged default chrome without wiring your own rules.

## Imports

```tsx
import { Accordion } from '@rosettadash/react/layout/accordion';
import { AccordionLinkList } from '@rosettadash/react/layout/accordion-link-list';
import { LinkList } from '@rosettadash/react/visual/link-list';
import { VideoSource } from '@rosettadash/react/visual/media/video-source';
import { EquirectViewport } from '@rosettadash/react/visual/media/equirect-viewport';
import { WasmMedia } from '@rosettadash/react/wasm/wasm-media';
```

Or barrel import:

```tsx
import { Accordion, LinkList, VideoSource } from '@rosettadash/react';
```

## Controlled accordion

```tsx
import { useState } from 'react';
import { Accordion } from '@rosettadash/react/layout/accordion';

export function Resources() {
  const [open, setOpen] = useState(false);
  return (
    <Accordion title="Resources" open={open} onOpenChange={setOpen}>
      <p>Panel body stays mounted; CSS hides it when closed.</p>
    </Accordion>
  );
}
```

## Custom-element events

Hosts listen for WC `CustomEvent`s and surface them as React props:

```tsx
<VideoSource
  label="Clip"
  onVideoFile={({ file, metadata }) => {
    console.log(file.name, metadata);
  }}
/>

<EquirectViewport previewMode="flat" onCropRegion={(detail) => console.log(detail)} />

<WasmMedia
  operation="equirect-extract"
  inputFile={file}
  onExtractComplete={({ blob }) => console.log(blob.size)}
/>
```

Non-attribute props (`inputFile`, `cropRegion` on WasmMedia) sync through the element’s `setProperty` API.

## Refs

All public components use `forwardRef`:

- Accordion / AccordionLinkList → root `HTMLElement` (`<section>`)
- LinkList → `HTMLUListElement`
- CE hosts → host `HTMLElement`

```tsx
const ref = useRef<HTMLElement>(null);
<Accordion ref={ref} title="Nav">…</Accordion>
```

## Styling choice

RosettaDash does **not** ship Tailwind/MUI as runtime dependencies. Pick a stack in the builder ([DAS-64](./11-planned-tickets.md)) or at integration time:

| Mode | Import | When |
|------|--------|------|
| Minimal | (none) | You style every `rd-*` rule in your stack |
| Tokens | `@rosettadash/web-components/tokens.css` | Shared `--rd-*` variables only |
| Themed default | `@rosettadash/web-components/styles.css` | Match Storybook / CE default chrome |

See [Stack styling guides](./41-stack-styling-guides.md) for Tailwind, plain CSS, CSS Modules, and MUI recipes.

## Storybook

`apps/storybook-react` loads tokens + `styles.css` globally. The **Getting Started / Styling modes** story compares minimal vs tokens vs full stylesheet side by side.

## Tests

Runtime tests register shadow bases via shared Jest setup (`packages/web-components/jest-setup.cjs`) so CE hosts resolve co-located HTML/CSS in Node.
