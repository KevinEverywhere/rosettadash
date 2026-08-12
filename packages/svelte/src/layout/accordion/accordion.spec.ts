import type { AccordionProps } from './types';

describe('@rosettadash/svelte/layout/accordion', () => {
  it('exposes a typed props contract', () => {
    const props: AccordionProps = {
      title: 'Resources',
      defaultOpen: false,
    };
    expect(props.title).toBe('Resources');
  });
});
