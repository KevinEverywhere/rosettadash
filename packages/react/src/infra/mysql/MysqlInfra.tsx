import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface MysqlInfraProps {
  label?: string;
  envKey?: string;
  tableOrCollection?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/infra/mysql — infra.mysql */
export const MysqlInfra = forwardRef<HTMLElement, MysqlInfraProps>(function MysqlInfra(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-mysql', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-mysql">
      <span className="rd-infra__badge">INFRA</span>
      {props.label ? <span className="rd-field__label">{props.label}</span> : null}
      {props.envKey ? <code>{props.envKey}</code> : null}
      {props.tableOrCollection ? <span className="rd-infra__meta">{props.tableOrCollection}</span> : null}
      {children}
    </section>
  );
});
