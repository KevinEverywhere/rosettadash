import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { EquirectViewport } from '@rosettadash/vue/visual/media/equirect-viewport';

const meta: Meta<typeof EquirectViewport> = {
  title: 'Visual/Media/Equirect Viewport',
  component: EquirectViewport,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof EquirectViewport>;

export const Default: Story = {
  render: () => ({
    components: { EquirectViewport },
    template: `<EquirectViewport style="display:block;width:100%;max-width:32rem;height:16rem;border:1px solid var(--rd-color-border, #ccc);border-radius:8px;" />`,
  }),
};
