import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import { Accordion } from './accordion';

describe('@rosettadash/vue/layout/accordion', () => {
  it('renders closed by default and toggles open', async () => {
    const wrapper = mount(Accordion, {
      props: { title: 'Resources' },
      slots: { default: '<p>Body</p>' },
    });

    expect(wrapper.find('[data-testid="rd-accordion"]').classes()).not.toContain(
      'rd-accordion--open',
    );
    expect(wrapper.find('.rd-accordion__panel').exists()).toBe(false);

    await wrapper.get('button').trigger('click');
    expect(wrapper.find('[data-testid="rd-accordion"]').classes()).toContain(
      'rd-accordion--open',
    );
    expect(wrapper.find('.rd-accordion__panel').text()).toContain('Body');
    expect(wrapper.emitted('toggle')?.[0]).toEqual([true]);
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true]);
  });

  it('honors defaultOpen', () => {
    const wrapper = mount(Accordion, {
      props: { title: 'Open', defaultOpen: true },
      slots: { default: '<span>Hi</span>' },
    });
    expect(wrapper.find('.rd-accordion__panel').exists()).toBe(true);
  });

  it('supports v-model:open controlled mode', async () => {
    const open = ref(false);
    const wrapper = mount({
      components: { Accordion },
      setup() {
        return { open };
      },
      template: `
        <Accordion v-model:open="open" title="Controlled">
          <p>Panel</p>
        </Accordion>
      `,
    });

    expect(wrapper.find('.rd-accordion__panel').exists()).toBe(false);
    await wrapper.get('button').trigger('click');
    expect(open.value).toBe(true);
    await nextTick();
    expect(wrapper.find('.rd-accordion__panel').exists()).toBe(true);

    open.value = false;
    await nextTick();
    expect(wrapper.find('.rd-accordion__panel').exists()).toBe(false);
  });
});
