import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface TextareaInputProps {
  label?: string;
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/input/textarea — visual.input.textarea */
export const TextareaInput = forwardRef<HTMLElement, TextareaInputProps>(function TextareaInput(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-input-textarea', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-input-textarea">
      {props.label ? <span className="rd-field__label">{props.label}</span> : null}
      <textarea
        className="rd-textarea"
        rows={props.rows ?? 4}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange?.(e.target.value)}
      />
      {children}
    </section>
  );
});
