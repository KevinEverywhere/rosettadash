import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { Accordion } from './Accordion';

describe('@rosettadash/react/layout/accordion', () => {
  it('renders closed by default and toggles open', () => {
    render(
      <Accordion title="Resources">
        <p>Body</p>
      </Accordion>,
    );

    expect(screen.getByTestId('rd-accordion').className).not.toContain(
      'rd-accordion--open',
    );
    expect(screen.queryByText('Body')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Resources/i }));
    expect(screen.getByTestId('rd-accordion').className).toContain(
      'rd-accordion--open',
    );
    expect(screen.getByText('Body')).toBeTruthy();
  });

  it('honors defaultOpen', () => {
    render(
      <Accordion title="Open" defaultOpen>
        <span>Hi</span>
      </Accordion>,
    );
    expect(screen.getByText('Hi')).toBeTruthy();
  });

  it('supports controlled open via onOpenChange', () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <Accordion title="Controlled" open={open} onOpenChange={setOpen}>
          <p>Panel</p>
        </Accordion>
      );
    }

    render(<Harness />);
    expect(screen.queryByText('Panel')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Controlled/i }));
    expect(screen.getByText('Panel')).toBeTruthy();
  });
});
