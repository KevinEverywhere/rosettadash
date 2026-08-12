# `@rosettadash/svelte`

RosettaDash **Svelte 5** runtime. Import paths match `@rosettadash/web-components`.

Peer dependency: `svelte` ^5.

Components ship as `.svelte` source (compiled by the consumer’s Vite / SvelteKit toolchain).

## Accordion (`bind:open`)

```svelte
<script lang="ts">
  import Accordion from '@rosettadash/svelte/layout/accordion';

  let open = $state(false);
</script>

<Accordion bind:open title="Resources">
  <p>Panel body</p>
</Accordion>
```

## Recipes (DAS-94)

```svelte
<script lang="ts">
  import Accordion from '@rosettadash/svelte/layout/accordion';
  import LinkList from '@rosettadash/svelte/visual/link-list';
  import AccordionLinkList from '@rosettadash/svelte/layout/accordion-link-list';

  const items = [
    { label: 'Docs', href: '/docs' },
    { label: 'API', href: '/api' },
  ];
</script>

<Accordion title="Resources">
  <LinkList {items} />
</Accordion>

<AccordionLinkList title="Resources" {items} />
```

## Media wrappers

```svelte
<script lang="ts">
  import VideoSource from '@rosettadash/svelte/visual/media/video-source';
  import EquirectViewport from '@rosettadash/svelte/visual/media/equirect-viewport';
</script>

<VideoSource label="Clip" sourceWidth={3840} sourceHeight={1920} onVideoFile={console.log} />
<EquirectViewport label="Viewport" previewMode="flat-crop" yaw={10} onCropRegion={console.log} />
```

Depends on `@rosettadash/web-components` for the underlying custom elements.

Pair with `@rosettadash/web-components/styles.css` for opt-in `--rd-*` chrome.
