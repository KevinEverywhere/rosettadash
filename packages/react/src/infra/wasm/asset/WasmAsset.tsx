import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface WasmAssetProps {
  assetPath?: string;
  gluePath?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/infra/wasm/asset — infra.wasm.asset */
export const WasmAsset = forwardRef<HTMLElement, WasmAssetProps>(function WasmAsset(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-wasm-asset', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-wasm-asset">
      <span className="rd-wasm__badge">WASM</span>
      <code>{props.assetPath ?? 'wasm/modules/example.wasm'}</code>
      {props.gluePath ? <span className="rd-wasm__glue">+ {props.gluePath}</span> : null}
      {children}
    </section>
  );
});
