import { AccordionLinkList } from './index';

describe('@rosettadash/vue/layout/accordion-link-list', () => {
  it('returns a recipe model with defaults', () => {
    const model = AccordionLinkList({ title: 'Resources' });
    expect(model.runtime).toBe('vue');
    expect(model.tag).toBe('rd-accordion-link-list');
    expect(model.props.defaultOpen).toBe(false);
    expect(model.props.items).toEqual([]);
  });
});
