<script lang="ts">
export const AUTHORING_SOURCE = `<AuthoringScreen locale={locale} selectedId={selectedId}>
  <!-- Cross-framework: Vue shell mounts React Authoring via ReactMount -->
  <ReactMount :component="AuthoringScreenReact" :component-props="{ locale, selectedId }" />
  <!-- React subtree: EquirectSphereViewport, FlatVideoViewport, WasmMedia (@rosettadash/react) -->
</AuthoringScreen>`;
</script>

<script setup lang="ts">
import ReactMount from '../components/ReactMount.vue';
import { AuthoringScreen as AuthoringScreenReact } from '../authoring/AuthoringScreen';

const props = defineProps<{ locale: string; selectedId: string }>();
</script>

<template>
  <div class="da-interop-callout" role="note">
    <strong>Cross-framework showcase.</strong>
    This screen is a Vue wrapper around a React subtree (<code>ReactMount.vue</code> →
    <code>authoring/AuthoringScreen.tsx</code>) so Authoring reuses
    <code>@rosettadash/react</code> viewports and WasmMedia. See About → Cross-framework composition.
  </div>
  <ReactMount
    :component="AuthoringScreenReact"
    :component-props="{ locale: props.locale, selectedId: props.selectedId }"
  />
</template>
