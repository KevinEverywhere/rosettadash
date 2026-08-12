import { Accordion } from './index';

describe('@rosettadash/angular/layout/accordion', () => {
  it('returns a angular runtime model with defaults', () => {
    const model = Accordion({ title: 'Resources' });
    expect(model.runtime).toBe('angular');
    expect(model.tag).toBe('rd-accordion');
    expect(model.props.title).toBe('Resources');
    expect(model.props.defaultOpen).toBe(false);
  });
});
