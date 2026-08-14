import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface LiveCaptureProps {
  label?: string;
  onStart?: () => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/media/live-capture — visual.media.live-capture */
export const LiveCapture = forwardRef<HTMLElement, LiveCaptureProps>(function LiveCapture(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-media-live-capture', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-media-live-capture">
      <span className="rd-media__label">{props.label ?? 'Live capture'}</span>
      <button type="button" className="rd-button" onClick={() => props.onStart?.()}>Start camera</button>
      {children}
    </section>
  );
});
