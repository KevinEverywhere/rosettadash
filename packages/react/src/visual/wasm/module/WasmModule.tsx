import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface WasmModuleProps {
  moduleLabel?: string;
  exportName?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/wasm/module — visual.wasm.module */
export const WasmModule = forwardRef<HTMLElement, WasmModuleProps>(function WasmModule(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-wasm-module', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-wasm-module">
      <span className="rd-wasm__label">{props.moduleLabel ?? 'WASM Module'}</span>
      <code>{props.exportName ?? 'run()'}()</code>
      {children}
    </section>
  );
});
