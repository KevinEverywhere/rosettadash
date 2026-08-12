import { mount } from '@vue/test-utils';
import { AccordionLinkList } from './accordion-link-list';

describe('@rosettadash/vue/layout/accordion-link-list', () => {
  it('composes accordion chrome with links after open', async () => {
    const wrapper = mount(AccordionLinkList, {
      props: {
        title: 'Resources',
        items: [{ label: 'Docs', href: '/docs' }],
      },
    });

    expect(wrapper.find('a').exists()).toBe(false);
    await wrapper.get('button').trigger('click');
    expect(wrapper.get('a.rd-link-list__link').attributes('href')).toBe('/docs');
    expect(wrapper.find('.rd-accordion-link-list').exists()).toBe(true);
  });

  it('applies dense + defaultOpen', () => {
    const wrapper = mount(AccordionLinkList, {
      props: {
        title: 'Nav',
        defaultOpen: true,
        dense: true,
        items: [{ label: 'Home', href: '/' }],
      },
    });
    expect(wrapper.find('.rd-link-list--dense').exists()).toBe(true);
    expect(wrapper.get('a').text()).toBe('Home');
  });
});
