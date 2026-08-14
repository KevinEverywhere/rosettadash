import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface ThreeGltfModelProps {
  title?: string;
  mode?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/display/3d-gltf-model — visual.display.3d-gltf-model */
export const ThreeGltfModel = forwardRef<HTMLElement, ThreeGltfModelProps>(function ThreeGltfModel(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-display-3d-gltf-model', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-display-3d-gltf-model" data-three-mode={props.mode} data-three-title={props.title} aria-label={props.title ?? '3D host'}>{children}</section>
  );
});
