import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/skeleton — visual.skeleton */
export const LoadingSkeleton = forwardRef<HTMLElement, LoadingSkeletonProps>(function LoadingSkeleton(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-skeleton', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-skeleton">
      {Array.from({ length: props.lines ?? 4 }).map((_, i) => (
        <span key={i} className={['rd-skeleton__line', i === 2 ? 'rd-skeleton__line--short' : ''].filter(Boolean).join(' ')} />
      ))}
      {children}
    </section>
  );
});
