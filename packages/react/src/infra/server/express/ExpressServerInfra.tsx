import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface ExpressServerInfraProps {
  label?: string;
  globalPrefix?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/infra/server/express — infra.server.express */
export const ExpressServerInfra = forwardRef<HTMLElement, ExpressServerInfraProps>(function ExpressServerInfra(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-server-express', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-server-express">
      <span className="rd-infra__badge">INFRA</span>
      {props.label ? <span className="rd-field__label">{props.label}</span> : null}
      {props.globalPrefix ? <code>globalPrefix: {props.globalPrefix}</code> : null}
      {children}
    </section>
  );
});
