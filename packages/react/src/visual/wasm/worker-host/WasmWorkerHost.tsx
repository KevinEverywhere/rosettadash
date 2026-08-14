import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface WasmWorkerHostProps {
  workerLabel?: string;
  workerStatus?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/wasm/worker-host — visual.wasm.worker-host */
export const WasmWorkerHost = forwardRef<HTMLElement, WasmWorkerHostProps>(function WasmWorkerHost(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-wasm-worker-host', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-wasm-worker-host">
      <span className="rd-wasm__label">{props.workerLabel ?? 'Worker'}</span>
      <span className="rd-wasm__status">{props.workerStatus ?? 'Idle'}</span>
      {children}
    </section>
  );
});
