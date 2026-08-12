# `@rosettadash/react`

RosettaDash **React** runtime. Import paths match `@rosettadash/web-components`.

Peer dependency: `react` >= 18 (`react-dom` recommended for apps).

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

Uncontrolled mode still works via `defaultOpen`.

## Recipes (DAS-94)

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

## Media wrappers

```tsx
import { VideoSource } from '@rosettadash/react/visual/media/video-source';
import { EquirectViewport } from '@rosettadash/react/visual/media/equirect-viewport';
```

Thin hosts over the WC runtime (same paths as `@rosettadash/web-components`).

Components render with `rd-*` BEM classnames. Pair with `@rosettadash/web-components/styles.css` for the opt-in light theme.
