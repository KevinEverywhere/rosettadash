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

## Media wrappers

```ts
import { VideoSource } from '@rosettadash/angular/visual/media/video-source';
import { EquirectViewport } from '@rosettadash/angular/visual/media/equirect-viewport';
```

```html
<rd-video-source label="Clip" [sourceWidth]="3840" [sourceHeight]="1920" (videoFile)="onVideoFile($event)" />
<rd-equirect-viewport label="Viewport" previewMode="flat-crop" [yaw]="10" (cropRegion)="onCrop($event)" />
```

Depends on `@rosettadash/web-components` for the underlying custom elements.

Pair with `@rosettadash/web-components/styles.css` for opt-in `--rd-*` chrome.

## Storybook

Clone the [RosettaDash repo](https://github.com/KevinEverywhere/rosettadash) and run `npm run storybook:angular` (port **6009**). See [GitHub — Storybook](https://github.com/KevinEverywhere/rosettadash#component-examples-storybook).
