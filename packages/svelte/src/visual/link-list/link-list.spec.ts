import { LinkList } from './index';

describe('@rosettadash/svelte/visual/link-list', () => {
  it('returns a svelte runtime model with defaults', () => {
    const model = LinkList();
    expect(model.runtime).toBe('svelte');
    expect(model.tag).toBe('rd-link-list');
    expect(model.props.items).toEqual([]);
    expect(model.props.dense).toBe(false);
  });
});
