<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    fieldLabel?: string;
    presets?: Array<{ id: string; label: string }>;
    activePresetId?: string;
  }>(),
  {
    presets: () => [],
    activePresetId: '5y',
  },
);

const emit = defineEmits<{ presetChange: [string] }>();
</script>

<template>
  <section class="rd-time-preset">
    <span v-if="fieldLabel" class="rd-field__label">{{ fieldLabel }}</span>
    <div class="rd-time-preset__buttons" role="group">
      <button
        v-for="preset in presets"
        :key="preset.id"
        type="button"
        class="rd-time-preset__button"
        :class="{ 'rd-time-preset__button--active': activePresetId === preset.id }"
        @click="emit('presetChange', preset.id)"
      >
        {{ preset.label }}
      </button>
    </div>
  </section>
</template>
