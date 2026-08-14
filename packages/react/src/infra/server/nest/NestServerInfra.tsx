import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface NestServerInfraProps {
  label?: string;
  globalPrefix?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/infra/server/nest — infra.server.nest */
export const NestServerInfra = forwardRef<HTMLElement, NestServerInfraProps>(function NestServerInfra(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-server-nest', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-server-nest">
      <span className="rd-infra__badge">INFRA</span>
      {props.label ? <span className="rd-field__label">{props.label}</span> : null}
      {props.globalPrefix ? <code>globalPrefix: {props.globalPrefix}</code> : null}
      {children}
    </section>
  );
});
