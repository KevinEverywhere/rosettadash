import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface TimePresetPreset {
  id: string;
  label: string;
}

export interface TimePresetProps {
  label?: string;
  presets?: TimePresetPreset[];
  activePresetId?: string;
  onPresetChange?: (presetId: string) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/domain/time-preset — domain.time-preset */
export const TimePreset = forwardRef<HTMLElement, TimePresetProps>(function TimePreset(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-time-preset', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-time-preset">
      {props.label ? <span className="rd-field__label">{props.label}</span> : null}
      <div className="rd-time-preset__buttons" role="group">
        {(props.presets ?? []).map((p) => (
          <button
            key={p.id}
            type="button"
            className={['rd-time-preset__button', props.activePresetId === p.id ? 'rd-time-preset__button--active' : ''].filter(Boolean).join(' ')}
            onClick={() => props.onPresetChange?.(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
      {children}
    </section>
  );
});
