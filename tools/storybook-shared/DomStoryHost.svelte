<script lang="ts">
  import { attachDomStory, clearDomStoryHost } from './dom-story-mount.js';

  let { mount }: { mount: () => HTMLElement } = $props();

  let host = $state<HTMLDivElement | null>(null);

  $effect(() => {
    if (!host) {
      return;
    }
    attachDomStory(host, mount);
    return () => {
      clearDomStoryHost(host);
    };
  });
</script>

<div bind:this={host} class="rd-dom-story-host"></div>
