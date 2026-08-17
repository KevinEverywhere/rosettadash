<script lang="ts">
  import type { ThemePreference } from '../lib/theme-preference.svelte';

  let {
    theme,
    class: className,
    onChange,
  }: {
    theme: ThemePreference;
    class?: string;
    onChange?: (theme: ThemePreference) => void;
  } = $props();
</script>

<label class={['da-theme-toggle', className].filter(Boolean).join(' ')}>
  <span>Theme</span>
  <select
    value={theme}
    aria-label="Color theme"
    onchange={(event) => onChange?.((event.currentTarget as HTMLSelectElement).value as ThemePreference)}
  >
    <option value="system">System</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
</label>
