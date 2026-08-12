import { mount } from '@vue/test-utils';
import { LinkList } from './link-list';

describe('@rosettadash/vue/visual/link-list', () => {
  it('defaults to an empty list', () => {
    const wrapper = mount(LinkList);
    expect(wrapper.findAll('a')).toHaveLength(0);
  });

  it('renders items with rd-* classnames', () => {
    const wrapper = mount(LinkList, {
      props: {
        items: [
          { label: 'Docs', href: '/docs' },
          { label: 'API', href: '/api' },
        ],
        dense: true,
      },
    });

    const root = wrapper.get('[data-testid="rd-link-list"]');
    expect(root.classes()).toContain('rd-link-list--dense');
    const links = wrapper.findAll('a.rd-link-list__link');
    expect(links).toHaveLength(2);
    expect(links[0].attributes('href')).toBe('/docs');
    expect(links[0].text()).toBe('Docs');
  });
});
