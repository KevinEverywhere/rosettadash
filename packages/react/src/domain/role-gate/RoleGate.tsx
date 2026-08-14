import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface RoleGateProps {
  label?: string;
  allowedRoles?: string[];
  statusText?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/domain/role-gate — domain.role-gate */
export const RoleGate = forwardRef<HTMLElement, RoleGateProps>(function RoleGate(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-role-gate', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-role-gate">
      {props.label ? <span className="rd-field__label">{props.label}</span> : null}
      <p className="rd-role-gate__status">{props.statusText ?? 'Visible'}</p>
      {props.allowedRoles?.length ? <code>{JSON.stringify(props.allowedRoles)}</code> : null}
      {children}
    </section>
  );
});
