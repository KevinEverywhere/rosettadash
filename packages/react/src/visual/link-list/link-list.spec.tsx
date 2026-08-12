import { render, screen } from '@testing-library/react';
import { LinkList } from './LinkList';

describe('@rosettadash/react/visual/link-list', () => {
  it('defaults to an empty list', () => {
    render(<LinkList />);
    expect(screen.getByTestId('rd-link-list').querySelectorAll('a')).toHaveLength(
      0,
    );
  });

  it('renders items with rd-* classnames', () => {
    render(
      <LinkList
        dense
        items={[
          { label: 'Docs', href: '/docs' },
          { label: 'API', href: '/api' },
        ]}
      />,
    );

    const root = screen.getByTestId('rd-link-list');
    expect(root.className).toContain('rd-link-list--dense');
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link.getAttribute('href')).toBe('/docs');
  });
});
