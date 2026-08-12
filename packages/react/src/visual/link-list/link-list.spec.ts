import { LinkList } from './index';

describe('@rosettadash/react/visual/link-list', () => {
  it('returns a react runtime model with defaults', () => {
    const model = LinkList();
    expect(model.runtime).toBe('react');
    expect(model.tag).toBe('rd-link-list');
    expect(model.props.items).toEqual([]);
    expect(model.props.dense).toBe(false);
  });

  it('passes items through', () => {
    const items = [{ label: 'Docs', href: '/docs' }];
    const model = LinkList({ items });
    expect(model.props.items).toEqual(items);
  });
});
