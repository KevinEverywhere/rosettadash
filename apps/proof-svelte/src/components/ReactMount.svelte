<script lang="ts">
  import { createElement, type ComponentType } from 'react';
  import { createRoot, type Root } from 'react-dom/client';

  let {
    component,
    componentProps = {},
  }: {
    component: ComponentType<Record<string, unknown>>;
    componentProps?: Record<string, unknown>;
  } = $props();

  let host = $state<HTMLDivElement | null>(null);
  let root: Root | null = null;

  function renderReact() {
    if (!host) {
      return;
    }
    if (!root) {
      root = createRoot(host);
    }
    root.render(createElement(component, { ...componentProps }));
  }

  $effect(() => {
    void component;
    const propsSnapshot = componentProps;
    if (propsSnapshot) {
      for (const key of Object.keys(propsSnapshot)) {
        void propsSnapshot[key];
      }
    }
    renderReact();
  });

  $effect(() => {
    return () => {
      root?.unmount();
      root = null;
    };
  });
</script>

<div bind:this={host}></div>
