<script setup lang="ts">
import { computed } from 'vue';
import { roleAllows, roleLabel, type AtlasUserRole } from '../lib/roles';

const props = withDefaults(
  defineProps<{
    gateLabel?: string;
    currentRole: AtlasUserRole;
    allowedRoles?: string[];
    statusText?: string;
    hiddenStatusText?: string;
  }>(),
  {
    allowedRoles: () => ['admin'],
  },
);

const allowed = computed(() => roleAllows(props.currentRole, props.allowedRoles));
const hiddenMessage = computed(
  () => props.hiddenStatusText ?? `This section is hidden for ${roleLabel(props.currentRole)} role.`,
);
</script>

<template>
  <section v-if="allowed" class="rd-role-gate">
    <span v-if="gateLabel" class="rd-field__label">{{ gateLabel }}</span>
    <p v-if="statusText" class="rd-role-gate__status">{{ statusText }}</p>
    <slot />
  </section>
  <p v-else class="rd-role-gate__status">{{ hiddenMessage }}</p>
</template>
