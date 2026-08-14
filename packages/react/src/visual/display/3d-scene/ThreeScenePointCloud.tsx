import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface ThreeScenePointCloudProps {
  title?: string;
  mode?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/display/3d-scene — visual.display.3d-scene */
export const ThreeScenePointCloud = forwardRef<HTMLElement, ThreeScenePointCloudProps>(function ThreeScenePointCloud(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-display-3d-scene', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-display-3d-scene" data-three-mode={props.mode} data-three-title={props.title} aria-label={props.title ?? '3D host'}>{children}</section>
  );
});
