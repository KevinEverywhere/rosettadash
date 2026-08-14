import { render, screen } from '@testing-library/react';
import { NumberInput } from './NumberInput.js';

describe('NumberInput', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<NumberInput />);
    expect(screen.getByTestId('rd-input-number')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<NumberInput ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
