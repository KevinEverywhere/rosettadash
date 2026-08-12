import { AccordionLinkList } from './index';

describe('@rosettadash/react/layout/accordion-link-list', () => {
  it('returns a recipe model with defaults', () => {
    const model = AccordionLinkList({ title: 'Resources' });
    expect(model.runtime).toBe('react');
    expect(model.tag).toBe('rd-accordion-link-list');
    expect(model.props.title).toBe('Resources');
    expect(model.props.defaultOpen).toBe(false);
    expect(model.props.items).toEqual([]);
    expect(model.props.dense).toBe(false);
  });
});
