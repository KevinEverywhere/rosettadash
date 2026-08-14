import { render, screen } from '@testing-library/react';
import { SvgIcon } from './SvgIcon.js';

describe('SvgIcon', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<SvgIcon />);
    expect(screen.getByTestId('rd-svg-icon')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<SvgIcon ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
