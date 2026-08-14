import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface ModalLayoutProps {
  title?: string;
  body?: string;
  confirmLabel?: string;
  open?: boolean;
  onConfirm?: () => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/layout/modal — layout.modal */
export const ModalLayout = forwardRef<HTMLElement, ModalLayoutProps>(function ModalLayout(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-modal', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-modal" role="dialog" aria-modal="true">
      <div className="rd-modal__dialog">
        <span className="rd-modal__title">{props.title ?? 'Dialog'}</span>
        {props.body ? <p className="rd-modal__body">{props.body}</p> : null}
        <button type="button" className="rd-modal__confirm" onClick={() => props.onConfirm?.()}>{props.confirmLabel ?? 'Confirm'}</button>
        {children}
      </div>
    </section>
  );
});
