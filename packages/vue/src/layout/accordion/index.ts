/** Shared public props for layout/accordion (parity with web-components). */
export interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
  className?: string;
  children?: unknown;
}

export interface AccordionRenderModel {
  runtime: 'vue';
  tag: 'rd-accordion';
  props: AccordionProps;
}

/** Thin vue adapter stub — locks export path for DAS-91 packaging. */
export function Accordion(props: AccordionProps): AccordionRenderModel {
  return {
    runtime: 'vue',
    tag: 'rd-accordion',
    props: {
      title: props.title,
      defaultOpen: props.defaultOpen ?? false,
      className: props.className,
      children: props.children,
    },
  };
}
