import type { Snippet } from 'svelte';

export interface AccordionProps {
  title: string;
  open?: boolean;
  defaultOpen?: boolean;
  className?: string;
  children?: Snippet;
}
