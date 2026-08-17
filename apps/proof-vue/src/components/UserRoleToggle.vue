<script setup lang="ts">
import type { AtlasUserRole } from '../lib/roles';
import { ATLAS_USER_ROLES, roleLabel } from '../lib/roles';

defineProps<{ role: AtlasUserRole }>();
const emit = defineEmits<{ change: [AtlasUserRole] }>();
</script>

<template>
  <div class="da-role-toggle" role="group" aria-label="Preview as user role">
    <span class="da-role-toggle__label">Role</span>
    <div class="da-role-toggle__options">
      <button
        v-for="entry in ATLAS_USER_ROLES"
        :key="entry.id"
        type="button"
        :aria-pressed="role === entry.id"
        :class="{ 'is-active': role === entry.id }"
        @click="emit('change', entry.id)"
      >
        {{ entry.label }}
      </button>
    </div>
    <span class="da-role-toggle__hint">Signed in as {{ roleLabel(role) }}</span>
  </div>
</template>
