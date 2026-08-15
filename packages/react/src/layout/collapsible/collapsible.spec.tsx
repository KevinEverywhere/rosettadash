import { fireEvent, render, screen } from '@testing-library/react';
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

  it('toggles panel visibility when header is clicked', () => {
    render(
      <Collapsible title="Integration keys">
        <p>Secret fields</p>
      </Collapsible>,
    );
    expect(screen.queryByText('Secret fields')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /integration keys/i }));
    expect(screen.getByText('Secret fields')).toBeTruthy();
  });
});
