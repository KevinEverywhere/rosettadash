import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface TextInputProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/input/text — visual.input.text */
export const TextInput = forwardRef<HTMLElement, TextInputProps>(function TextInput(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-input-text', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-input-text">
      {props.label ? <span className="rd-field__label">{props.label}</span> : null}
      <input
        type="text"
        className="rd-input"
        placeholder={props.placeholder}
        required={props.required}
        value={props.value}
        defaultValue={props.defaultValue}
        onChange={(e) => props.onChange?.(e.target.value)}
      />
      {children}
    </section>
  );
});
