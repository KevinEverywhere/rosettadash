import { render, screen } from '@testing-library/react';
import { FlexLayout } from './FlexLayout.js';

describe('FlexLayout', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<FlexLayout />);
    expect(screen.getByTestId('rd-flex')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<FlexLayout ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
