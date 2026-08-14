import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface NumberInputProps {
  label?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/input/number — visual.input.number */
export const NumberInput = forwardRef<HTMLElement, NumberInputProps>(function NumberInput(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-input-number', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-input-number">
      {props.label ? <span className="rd-field__label">{props.label}</span> : null}
      <input
        type="number"
        className="rd-input"
        placeholder={props.placeholder}
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange?.(Number(e.target.value))}
      />
      {children}
    </section>
  );
});
