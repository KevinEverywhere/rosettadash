import { type CSSProperties, type ReactNode } from 'react';

export interface FormSectionGridProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export interface FormSectionProps {
  title: string;
  fullWidth?: boolean;
  columns?: 1 | 2;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function FormSectionGridRoot({ className, style, children }: FormSectionGridProps) {
  return (
    <div className={['rd-form-section-grid', className].filter(Boolean).join(' ')} style={style} data-testid="rd-form-section-grid">
      {children}
    </div>
  );
}

function FormSection({ title, fullWidth, columns = 1, className, style, children }: FormSectionProps) {
  const sectionClass = ['rd-form-section', fullWidth ? 'rd-form-section--full' : '', className]
    .filter(Boolean)
    .join(' ');
  const bodyClass = ['rd-form-section__body', columns === 2 ? 'rd-form-section__body--2col' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <section className={sectionClass} style={style} data-testid="rd-form-section">
      <h3 className="rd-form-section__title">{title}</h3>
      <div className={bodyClass}>{children}</div>
    </section>
  );
}

/** @rosettadash/react/layout/form-section — layout.form-section */
export const FormSectionGrid = Object.assign(FormSectionGridRoot, { Section: FormSection });
