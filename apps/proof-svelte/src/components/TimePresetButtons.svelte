<script lang="ts">
  let {
    fieldLabel,
    presets = [],
    activePresetId = '5y',
    onPresetChange,
  }: {
    fieldLabel?: string;
    presets?: Array<{ id: string; label: string }>;
    activePresetId?: string;
    onPresetChange?: (presetId: string) => void;
  } = $props();
</script>

<section class="rd-time-preset">
  {#if fieldLabel}<span class="rd-field__label">{fieldLabel}</span>{/if}
  <div class="rd-time-preset__buttons" role="group">
    {#each presets as preset (preset.id)}
      <button
        type="button"
        class="rd-time-preset__button"
        class:rd-time-preset__button--active={activePresetId === preset.id}
        onclick={() => onPresetChange?.(preset.id)}
      >
        {preset.label}
      </button>
    {/each}
  </div>
</section>
