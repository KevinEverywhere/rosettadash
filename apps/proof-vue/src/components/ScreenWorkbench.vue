<script setup lang="ts">
import ComponentSourcePanel from './ComponentSourcePanel.vue';
import ScreenWorkbenchMobileToggle from './ScreenWorkbenchMobileToggle.vue';
import ScreenWorkbenchPreview from './ScreenWorkbenchPreview.vue';
import { ref } from 'vue';

defineProps<{
  source: string;
}>();

const mobileView = ref<'preview' | 'source'>('preview');
</script>

<template>
  <ScreenWorkbenchMobileToggle :mobile-view="mobileView" @change="mobileView = $event" />
  <ScreenWorkbenchPreview :mobile-view="mobileView">
    <slot />
  </ScreenWorkbenchPreview>
  <ComponentSourcePanel :source="source" :hidden="mobileView === 'preview'" />
</template>
