import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface RoleAssignProps {
  summary?: string;
  roleOptions?: { value: string; label: string }[];
  onConfirm?: (role: string) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/domain/role-assign — domain.role-assign */
export const RoleAssign = forwardRef<HTMLElement, RoleAssignProps>(function RoleAssign(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-role-assign', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-role-assign">
      <span className="rd-field__label">Assign role</span>
      {props.summary ? <p className="rd-onboarding__summary">{props.summary}</p> : null}
      <select className="rd-select">{(props.roleOptions ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
      <button type="button" className="rd-button" onClick={() => props.onConfirm?.('')}>Confirm access</button>
      {children}
    </section>
  );
});
