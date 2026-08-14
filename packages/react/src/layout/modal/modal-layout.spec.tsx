import { render, screen } from '@testing-library/react';
import { ModalLayout } from './ModalLayout.js';

describe('ModalLayout', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<ModalLayout />);
    expect(screen.getByTestId('rd-modal')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<ModalLayout ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
