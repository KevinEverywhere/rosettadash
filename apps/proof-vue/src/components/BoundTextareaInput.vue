<script setup lang="ts">
defineProps<{
  fieldLabel?: string;
  placeholder?: string;
  value?: string;
  rows?: number;
}>();

const emit = defineEmits<{ 'update:value': [string] }>();
</script>

<template>
  <section class="rd-input-textarea">
    <span v-if="fieldLabel" class="rd-field__label">{{ fieldLabel }}</span>
    <textarea
      class="rd-textarea"
      :rows="rows ?? 4"
      :placeholder="placeholder ?? ''"
      :value="value ?? ''"
      @input="emit('update:value', ($event.target as HTMLTextAreaElement).value)"
    />
  </section>
</template>
