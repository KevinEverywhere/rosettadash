import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface ThreeGeoGlobeProps {
  title?: string;
  mode?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/display/3d-geo-globe — visual.display.3d-geo-globe */
export const ThreeGeoGlobe = forwardRef<HTMLElement, ThreeGeoGlobeProps>(function ThreeGeoGlobe(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-display-3d-geo-globe', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-display-3d-geo-globe" data-three-mode={props.mode} data-three-title={props.title} aria-label={props.title ?? '3D host'}>{children}</section>
  );
});
