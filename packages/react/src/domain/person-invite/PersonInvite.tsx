import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface PersonInviteProps {
  emailPlaceholder?: string;
  onInvite?: (email: string) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/domain/person-invite — domain.person-invite */
export const PersonInvite = forwardRef<HTMLElement, PersonInviteProps>(function PersonInvite(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-person-invite', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-person-invite">
      <span className="rd-field__label">Invite team member</span>
      <input type="email" className="rd-input" placeholder={props.emailPlaceholder ?? 'name@company.com'} />
      <button type="button" className="rd-button" onClick={() => props.onInvite?.('')}>Send invite</button>
      {children}
    </section>
  );
});
