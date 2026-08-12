import {
  useId,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

/** Public props contract for layout/accordion (parity with web-components). */
export interface AccordionProps {
  title: string;
  /** Controlled open state. When set, pair with `onOpenChange`. */
  open?: boolean;
  defaultOpen?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  /** @deprecated Prefer `onOpenChange` — still emitted for compatibility. */
  onToggle?: (open: boolean) => void;
}

export function Accordion({
  title,
  open: openProp,
  defaultOpen = false,
  className,
  style,
  children,
  onOpenChange,
  onToggle,
}: AccordionProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? Boolean(openProp) : uncontrolledOpen;
  const panelId = useId();

  function setOpen(next: boolean): void {
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
    onToggle?.(next);
  }

  function toggle(): void {
    setOpen(!open);
  }

  const rootClass = ['rd-accordion', open ? 'rd-accordion--open' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={rootClass} style={style} data-testid="rd-accordion">
      <button
        type="button"
        className="rd-accordion__header"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
      >
        <span className="rd-accordion__title">{title}</span>
        <span className="rd-accordion__chevron" aria-hidden="true">
          ›
        </span>
      </button>
      {open ? (
        <div className="rd-accordion__panel" id={panelId} role="region">
          {children}
        </div>
      ) : null}
    </section>
  );
}
