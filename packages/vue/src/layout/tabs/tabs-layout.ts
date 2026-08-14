import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface TabsLayoutTab {
  id: string;
  label: string;
}

export interface TabsLayoutProps {
  title?: string;
  tabs?: TabsLayoutTab[];
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

/** @rosettadash/vue/layout/tabs — layout.tabs */
export const TabsLayout = defineComponent({
  name: 'RdTabsLayout',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    title: { type: String as PropType<string | undefined>, default: undefined },
    tabs: { type: Array as PropType<TabsLayoutTab[] | undefined>, default: undefined },
    activeTabId: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    function tabClass(id: string): string {
      return ['rd-tabs__tab', props.activeTabId === id ? 'rd-tabs__tab--active' : ''].filter(Boolean).join(' ');
    }
    return () => {
      const rootClass = ['rd-tabs', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-tabs' }, [
      props.title ? h('span', { class: 'rd-tabs__title' }, props.title) : null,
      h('div', { class: 'rd-tabs__tabs', role: 'tablist' }, (props.tabs ?? []).map((tab) =>
        h('button', { type: 'button', key: tab.id, role: 'tab', class: tabClass(tab.id) }, tab.label),
      )),
      h('div', { class: 'rd-tabs__panel' }, slots.default?.()),
    ]);
    };
  },
});

export type TabsLayoutComponent = typeof TabsLayout;
