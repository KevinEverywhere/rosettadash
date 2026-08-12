import { Accordion } from './index';

describe('@rosettadash/svelte/layout/accordion', () => {
  it('returns a svelte runtime model with defaults', () => {
    const model = Accordion({ title: 'Resources' });
    expect(model.runtime).toBe('svelte');
    expect(model.tag).toBe('rd-accordion');
    expect(model.props.title).toBe('Resources');
    expect(model.props.defaultOpen).toBe(false);
  });
});
