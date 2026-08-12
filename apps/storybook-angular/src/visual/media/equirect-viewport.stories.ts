import type { Meta, StoryObj } from '@storybook/angular-vite';
import { EquirectViewport } from '@rosettadash/angular/visual/media/equirect-viewport';

const meta: Meta<EquirectViewport> = {
  title: 'Visual/Media/Equirect Viewport',
  component: EquirectViewport,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<EquirectViewport>;

export const Default: Story = {
  render: () => ({
    template: `<rd-equirect-viewport style="display:block;width:100%;max-width:32rem;height:16rem;border:1px solid var(--rd-color-border, #ccc);border-radius:8px;"></rd-equirect-viewport>`,
  }),
};
