import { render, screen } from '@testing-library/react';
import { CheckboxInput } from './CheckboxInput.js';

describe('CheckboxInput', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<CheckboxInput />);
    expect(screen.getByTestId('rd-input-checkbox')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<CheckboxInput ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
