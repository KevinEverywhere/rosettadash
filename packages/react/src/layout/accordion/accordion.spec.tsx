import { createRef } from 'react';
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

    const root = screen.getByTestId('rd-accordion');
    const trigger = screen.getByRole('button', { name: /Resources/i });

    expect(root.className).not.toContain('rd-accordion--open');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByText('Body')).toBeTruthy();

    fireEvent.click(trigger);
    expect(root.className).toContain('rd-accordion--open');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('honors defaultOpen', () => {
    render(
      <Accordion title="Open" defaultOpen>
        <span>Hi</span>
      </Accordion>,
    );
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('true');
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
    const trigger = screen.getByRole('button', { name: /Controlled/i });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Panel')).toBeTruthy();
  });

  it('forwards ref to the root section', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Accordion ref={ref} title="Ref">
        <p>Body</p>
      </Accordion>,
    );
    expect(ref.current?.tagName).toBe('SECTION');
    expect(ref.current?.getAttribute('data-testid')).toBe('rd-accordion');
  });
});
