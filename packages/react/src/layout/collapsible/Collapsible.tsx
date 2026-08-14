import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface CollapsibleProps {
  title?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/layout/collapsible — layout.collapsible */
export const Collapsible = forwardRef<HTMLElement, CollapsibleProps>(function Collapsible(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-collapsible', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-collapsible">
      <button type="button" className="rd-collapsible__header" aria-expanded={props.open ?? props.defaultOpen ?? false}>
        <span>{props.title ?? 'Section'}</span>
      </button>
      <div className="rd-collapsible__panel">{children}</div>
    </section>
  );
});
