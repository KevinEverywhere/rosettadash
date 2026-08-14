import { render, screen } from '@testing-library/react';
import { SelectInput } from './SelectInput.js';

describe('SelectInput', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<SelectInput />);
    expect(screen.getByTestId('rd-input-select')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<SelectInput ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
