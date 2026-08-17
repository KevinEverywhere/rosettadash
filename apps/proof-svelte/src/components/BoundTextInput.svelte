<script lang="ts">
  let {
    fieldLabel,
    placeholder,
    value = '',
    inputType = 'text',
    onValueChange,
  }: {
    fieldLabel?: string;
    placeholder?: string;
    value?: string;
    inputType?: 'text' | 'password';
    onValueChange?: (value: string) => void;
  } = $props();
</script>

<section class="rd-input-text">
  {#if fieldLabel}<span class="rd-field__label">{fieldLabel}</span>{/if}
  <input
    class="rd-input"
    type={inputType}
    {placeholder}
    {value}
    oninput={(event) => onValueChange?.((event.currentTarget as HTMLInputElement).value)}
  />
</section>
