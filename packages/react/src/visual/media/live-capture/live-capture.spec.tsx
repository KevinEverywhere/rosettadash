import { render, screen } from '@testing-library/react';
import { LiveCapture } from './LiveCapture.js';

describe('LiveCapture', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<LiveCapture />);
    expect(screen.getByTestId('rd-media-live-capture')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<LiveCapture ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
