import { LinkList } from './index';

describe('@rosettadash/angular/visual/link-list', () => {
  it('returns an angular runtime model with defaults', () => {
    const model = LinkList();
    expect(model.runtime).toBe('angular');
    expect(model.tag).toBe('rd-link-list');
    expect(model.props.items).toEqual([]);
    expect(model.props.dense).toBe(false);
  });
});
