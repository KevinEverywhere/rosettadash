import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface CheckboxInputProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/input/checkbox — visual.input.checkbox */
export const CheckboxInput = forwardRef<HTMLElement, CheckboxInputProps>(function CheckboxInput(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-input-checkbox', className].filter(Boolean).join(' ');

  return (
    <label ref={ref as React.Ref<HTMLLabelElement>} className={[rootClass, 'rd-field--checkbox'].join(' ')} style={style} data-testid="rd-input-checkbox">
      <input
        type="checkbox"
        className="rd-checkbox"
        checked={props.checked}
        defaultChecked={props.defaultChecked}
        onChange={(e) => props.onChange?.(e.target.checked)}
      />
      {props.label ? <span className="rd-field__label">{props.label}</span> : null}
      {children}
    </label>
  );
});
