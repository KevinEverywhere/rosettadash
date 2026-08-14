import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface SelectInputOption {
  value: string;
  label: string;
}

export interface SelectInputProps {
  label?: string;
  placeholder?: string;
  options?: SelectInputOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/input/select — visual.input.select */
export const SelectInput = forwardRef<HTMLElement, SelectInputProps>(function SelectInput(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-input-select', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-input-select">
      {props.label ? <span className="rd-field__label">{props.label}</span> : null}
      <select
        className="rd-select"
        value={props.value}
        onChange={(e) => props.onChange?.(e.target.value)}
      >
        <option value="">{props.placeholder ?? 'Select…'}</option>
        {(props.options ?? []).map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {children}
    </section>
  );
});
