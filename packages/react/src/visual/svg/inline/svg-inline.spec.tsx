import { render, screen } from '@testing-library/react';
import { SvgInline } from './SvgInline.js';

describe('SvgInline', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<SvgInline />);
    expect(screen.getByTestId('rd-svg-inline')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<SvgInline ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
