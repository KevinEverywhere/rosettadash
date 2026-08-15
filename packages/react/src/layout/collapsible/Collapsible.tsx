import { useState, forwardRef, useCallback, type CSSProperties, type ReactNode } from 'react';

export interface CollapsibleProps {
  title?: string;
  summary?: string;
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
  const { className, style, children, title, summary } = props;
  const [internalOpen, setInternalOpen] = useState(props.defaultOpen ?? false);
  const isControlled = props.open !== undefined;
  const open = isControlled ? props.open : internalOpen;

  const toggle = useCallback(() => {
    const next = !open;
    if (!isControlled) {
      setInternalOpen(next);
    }
    props.onOpenChange?.(next);
  }, [isControlled, open, props]);

  const rootClass = ['rd-collapsible', open ? 'is-open' : '', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-collapsible">
      <button
        type="button"
        className="rd-collapsible__header"
        aria-expanded={open}
        onClick={toggle}
      >
        <span className="rd-collapsible__titles">
          <span className="rd-collapsible__title">{title ?? 'Section'}</span>
          {summary ? <span className="rd-collapsible__summary">{summary}</span> : null}
        </span>
        <span className="rd-collapsible__chevron" aria-hidden="true">
          {open ? '▾' : '▸'}
        </span>
      </button>
      {open ? <div className="rd-collapsible__panel">{children}</div> : null}
    </section>
  );
});
