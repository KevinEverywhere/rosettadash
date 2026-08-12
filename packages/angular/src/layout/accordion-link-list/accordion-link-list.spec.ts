import type { AccordionLinkListProps } from './accordion-link-list';

describe('@rosettadash/angular/layout/accordion-link-list', () => {
  it('exposes a typed props contract', () => {
    const props: AccordionLinkListProps = { title: 'Resources', items: [] };
    expect(props.title).toBe('Resources');
  });
});
