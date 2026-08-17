<script lang="ts">
  import { ATLAS_USER_ROLES, roleLabel, type AtlasUserRole } from '../lib/roles';

  let {
    role,
    onChange,
  }: {
    role: AtlasUserRole;
    onChange?: (role: AtlasUserRole) => void;
  } = $props();
</script>

<div class="da-role-toggle" role="group" aria-label="Preview as user role">
  <span class="da-role-toggle__label">Role</span>
  <div class="da-role-toggle__options">
    {#each ATLAS_USER_ROLES as entry (entry.id)}
      <button
        type="button"
        aria-pressed={role === entry.id}
        class:is-active={role === entry.id}
        onclick={() => onChange?.(entry.id)}
      >
        {entry.label}
      </button>
    {/each}
  </div>
  <span class="da-role-toggle__hint">Signed in as {roleLabel(role)}</span>
</div>
