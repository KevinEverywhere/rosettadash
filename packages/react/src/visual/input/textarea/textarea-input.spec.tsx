import { render, screen } from '@testing-library/react';
import { TextareaInput } from './TextareaInput.js';

describe('TextareaInput', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<TextareaInput />);
    expect(screen.getByTestId('rd-input-textarea')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<TextareaInput ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
