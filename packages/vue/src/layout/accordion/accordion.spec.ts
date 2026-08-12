import { Accordion } from './index';

describe('@rosettadash/vue/layout/accordion', () => {
  it('returns a vue runtime model with defaults', () => {
    const model = Accordion({ title: 'Resources' });
    expect(model.runtime).toBe('vue');
    expect(model.tag).toBe('rd-accordion');
    expect(model.props.title).toBe('Resources');
    expect(model.props.defaultOpen).toBe(false);
  });
});
