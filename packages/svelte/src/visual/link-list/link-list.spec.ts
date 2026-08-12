import type { LinkListProps } from './types';

describe('@rosettadash/svelte/visual/link-list', () => {
  it('exposes a typed props contract', () => {
    const props: LinkListProps = {
      items: [{ label: 'Docs', href: '/docs' }],
      dense: true,
    };
    expect(props.items).toHaveLength(1);
  });
});
