<script lang="ts">
  import { roleAllows, roleLabel, type AtlasUserRole } from '../lib/roles';
  import type { Snippet } from 'svelte';

  let {
    gateLabel,
    currentRole,
    allowedRoles = ['admin'],
    statusText,
    hiddenStatusText,
    children,
  }: {
    gateLabel?: string;
    currentRole: AtlasUserRole;
    allowedRoles?: string[];
    statusText?: string;
    hiddenStatusText?: string;
    children?: Snippet;
  } = $props();

  const allowed = $derived(roleAllows(currentRole, allowedRoles));
  const hiddenMessage = $derived(
    hiddenStatusText ?? `This section is hidden for ${roleLabel(currentRole)} role.`,
  );
</script>

{#if allowed}
  <section class="rd-role-gate">
    {#if gateLabel}<span class="rd-field__label">{gateLabel}</span>{/if}
    {#if statusText}<p class="rd-role-gate__status">{statusText}</p>{/if}
    {@render children?.()}
  </section>
{:else}
  <p class="rd-role-gate__status">{hiddenMessage}</p>
{/if}
