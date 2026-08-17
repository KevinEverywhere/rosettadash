<script lang="ts">
  import { CLIENT_ROUTER_MODE_OPTIONS, type ClientRouterMode } from '@rosettadash/core';

  let {
    mode,
    onChange,
  }: {
    mode: ClientRouterMode;
    onChange?: (mode: ClientRouterMode) => void;
  } = $props();
</script>

<label class="da-router-mode">
  <span>Router</span>
  <select
    value={mode}
    aria-label="Client router mode"
    onchange={(event) => onChange?.((event.currentTarget as HTMLSelectElement).value as ClientRouterMode)}
  >
    {#each CLIENT_ROUTER_MODE_OPTIONS as option (option.id)}
      <option value={option.id}>{option.label}</option>
    {/each}
  </select>
</label>
