import { AccordionLinkList } from './index';

describe('@rosettadash/svelte/layout/accordion-link-list', () => {
  it('returns a recipe model with defaults', () => {
    const model = AccordionLinkList({ title: 'Resources' });
    expect(model.runtime).toBe('svelte');
    expect(model.tag).toBe('rd-accordion-link-list');
    expect(model.props.defaultOpen).toBe(false);
    expect(model.props.items).toEqual([]);
  });
});
