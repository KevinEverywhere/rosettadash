import {
  defineComponent,
  h,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type PropType,
} from 'vue';
import { attachDomStory, clearDomStoryHost } from './dom-story-mount.js';

export default defineComponent({
  name: 'DomStoryHost',
  props: {
    mount: {
      type: Function as PropType<() => HTMLElement>,
      required: true,
    },
  },
  setup(props) {
    const hostRef = ref<HTMLElement | null>(null);

    const renderMount = () => {
      if (hostRef.value) {
        attachDomStory(hostRef.value, props.mount);
      }
    };

    onMounted(renderMount);
    watch(() => props.mount, renderMount);
    onUnmounted(() => {
      if (hostRef.value) {
        clearDomStoryHost(hostRef.value);
      }
    });

    return () =>
      h('div', {
        class: 'rd-dom-story-host',
        ref: (element: unknown) => {
          hostRef.value = element as HTMLElement | null;
          if (hostRef.value) {
            renderMount();
          }
        },
      });
  },
});
