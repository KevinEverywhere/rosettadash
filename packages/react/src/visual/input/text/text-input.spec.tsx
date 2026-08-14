import { render, screen } from '@testing-library/react';
import { TextInput } from './TextInput.js';

describe('TextInput', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<TextInput />);
    expect(screen.getByTestId('rd-input-text')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<TextInput ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
