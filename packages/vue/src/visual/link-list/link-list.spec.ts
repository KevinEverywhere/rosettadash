import { LinkList } from './index';

describe('@rosettadash/vue/visual/link-list', () => {
  it('returns a vue runtime model with defaults', () => {
    const model = LinkList();
    expect(model.runtime).toBe('vue');
    expect(model.tag).toBe('rd-link-list');
    expect(model.props.items).toEqual([]);
    expect(model.props.dense).toBe(false);
  });
});
