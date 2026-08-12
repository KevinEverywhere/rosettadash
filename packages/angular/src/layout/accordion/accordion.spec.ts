import type { AccordionProps } from './accordion';

describe('@rosettadash/angular/layout/accordion', () => {
  it('exposes a typed props contract', () => {
    const props: AccordionProps = { title: 'Resources', defaultOpen: false };
    expect(props.title).toBe('Resources');
  });
});
