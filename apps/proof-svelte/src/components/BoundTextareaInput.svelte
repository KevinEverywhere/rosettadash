<script lang="ts">
  let {
    fieldLabel,
    placeholder,
    value = '',
    rows = 4,
    onValueChange,
  }: {
    fieldLabel?: string;
    placeholder?: string;
    value?: string;
    rows?: number;
    onValueChange?: (value: string) => void;
  } = $props();
</script>

<section class="rd-input-textarea">
  {#if fieldLabel}<span class="rd-field__label">{fieldLabel}</span>{/if}
  <textarea
    class="rd-textarea"
    {rows}
    {placeholder}
    {value}
    oninput={(event) => onValueChange?.((event.currentTarget as HTMLTextAreaElement).value)}
  ></textarea>
</section>
