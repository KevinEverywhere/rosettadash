# `@rosettadash/vue`

RosettaDash **Vue 3** runtime. Import paths match `@rosettadash/web-components`.

Peer dependency: `vue` ^3.5.  
Depends on `@rosettadash/web-components` for media custom-element hosts.

## Accordion (`v-model:open`)

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Accordion } from '@rosettadash/vue/layout/accordion';

const open = ref(false);
</script>

<template>
  <Accordion v-model:open="open" title="Resources">
    <p>Panel body</p>
  </Accordion>
</template>
```

Uncontrolled mode still works via `default-open`.

## Recipes (DAS-94)

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Accordion } from '@rosettadash/vue/layout/accordion';
import { LinkList } from '@rosettadash/vue/visual/link-list';
import { AccordionLinkList } from '@rosettadash/vue/layout/accordion-link-list';

const open = ref(false);
const items = [
  { label: 'Docs', href: '/docs' },
  { label: 'API', href: '/api' },
];
</script>

<template>
  <Accordion title="Resources">
    <LinkList :items="items" />
  </Accordion>

  <AccordionLinkList v-model:open="open" title="Resources" :items="items" />
</template>
```

## Media wrappers

Thin Vue hosts over the WC runtime — same paths as `@rosettadash/web-components`:

```vue
<script setup lang="ts">
import { VideoSource } from '@rosettadash/vue/visual/media/video-source';
import { EquirectViewport } from '@rosettadash/vue/visual/media/equirect-viewport';
</script>

<template>
  <VideoSource label="Clip" :source-width="3840" :source-height="1920" @video-file="console.log" />
  <EquirectViewport label="Viewport" preview-mode="flat-crop" :yaw="10" @crop-region="console.log" />
</template>
```

Pair with `@rosettadash/web-components/styles.css` / `tokens.css` for opt-in `--rd-*` chrome. Storybook: **Getting Started → Styling modes** on port 6008 (`npm run storybook:vue`).
