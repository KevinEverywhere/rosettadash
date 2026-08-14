import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface MongodbInfraProps {
  label?: string;
  envKey?: string;
  tableOrCollection?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/infra/mongodb — infra.mongodb */
export const MongodbInfra = forwardRef<HTMLElement, MongodbInfraProps>(function MongodbInfra(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-mongodb', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-mongodb">
      <span className="rd-infra__badge">INFRA</span>
      {props.label ? <span className="rd-field__label">{props.label}</span> : null}
      {props.envKey ? <code>{props.envKey}</code> : null}
      {props.tableOrCollection ? <span className="rd-infra__meta">{props.tableOrCollection}</span> : null}
      {children}
    </section>
  );
});
