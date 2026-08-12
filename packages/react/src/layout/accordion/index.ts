/**
 * Shared public props for layout/accordion (parity with web-components).
 * Full DOM wiring lands with richer adapters; this package locks the export path.
 */
export interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
  className?: string;
  children?: unknown;
}

export interface AccordionRenderModel {
  runtime: 'react';
  tag: 'rd-accordion';
  props: AccordionProps;
}

/**
 * Thin React-oriented adapter stub.
 * Consumers depend on peer `react`; richer JSX component follows in DAS-96.
 */
export function Accordion(props: AccordionProps): AccordionRenderModel {
  return {
    runtime: 'react',
    tag: 'rd-accordion',
    props: {
      title: props.title,
      defaultOpen: props.defaultOpen ?? false,
      className: props.className,
      children: props.children,
    },
  };
}
