import type { AccordionLinkListProps } from './types';

describe('@rosettadash/svelte/layout/accordion-link-list', () => {
  it('exposes a typed props contract', () => {
    const props: AccordionLinkListProps = {
      title: 'Resources',
      items: [],
    };
    expect(props.title).toBe('Resources');
  });
});
