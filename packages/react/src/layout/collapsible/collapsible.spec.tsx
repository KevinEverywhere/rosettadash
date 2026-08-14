import { render, screen } from '@testing-library/react';
import { Collapsible } from './Collapsible.js';

describe('Collapsible', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<Collapsible />);
    expect(screen.getByTestId('rd-collapsible')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<Collapsible ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
