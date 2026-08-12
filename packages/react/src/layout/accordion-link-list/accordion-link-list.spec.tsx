import { fireEvent, render, screen } from '@testing-library/react';
import { AccordionLinkList } from './AccordionLinkList';

describe('@rosettadash/react/layout/accordion-link-list', () => {
  it('composes accordion chrome with links after open', () => {
    render(
      <AccordionLinkList
        title="Resources"
        items={[{ label: 'Docs', href: '/docs' }]}
      />,
    );

    expect(screen.queryByRole('link', { name: 'Docs' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Resources/i }));
    expect(screen.getByRole('link', { name: 'Docs' }).getAttribute('href')).toBe(
      '/docs',
    );
    expect(screen.getByTestId('rd-accordion').className).toContain(
      'rd-accordion-link-list',
    );
  });
});
