import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface EnvConfigProps {
  envKeys?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/infra/env — infra.env */
export const EnvConfig = forwardRef<HTMLElement, EnvConfigProps>(function EnvConfig(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-env', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-env">
      <span className="rd-infra__badge">INFRA</span>
      <span className="rd-field__label">Environment config</span>
      <code>{props.envKeys ?? 'DATABASE_URL, API_KEY'}</code>
      {children}
    </section>
  );
});
