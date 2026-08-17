<script setup lang="ts">
defineProps<{
  fieldLabel?: string;
  placeholder?: string;
  value?: string;
  inputType?: 'text' | 'password';
}>();

const emit = defineEmits<{ 'update:value': [string] }>();
</script>

<template>
  <section class="rd-input-text">
    <span v-if="fieldLabel" class="rd-field__label">{{ fieldLabel }}</span>
    <input
      class="rd-input"
      :type="inputType ?? 'text'"
      :placeholder="placeholder ?? ''"
      :value="value ?? ''"
      @input="emit('update:value', ($event.target as HTMLInputElement).value)"
    />
  </section>
</template>
