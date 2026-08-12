import { fireEvent, render, screen } from '@testing-library/react';
import { AccordionLinkList } from './AccordionLinkList';

describe('@rosettadash/react/layout/accordion-link-list', () => {
  it('composes accordion chrome with link list (panel always mounted)', () => {
    render(
      <AccordionLinkList
        title="Resources"
        items={[{ label: 'Docs', href: '/docs' }]}
      />,
    );

    const root = screen.getByTestId('rd-accordion');
    const trigger = screen.getByRole('button', { name: /Resources/i });
    const link = screen.getByRole('link', { name: 'Docs' });

    expect(root.className).toContain('rd-accordion-link-list');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(link.getAttribute('href')).toBe('/docs');

    fireEvent.click(trigger);
    expect(root.className).toContain('rd-accordion--open');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });
});
