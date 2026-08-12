import type { Meta, StoryObj } from '@storybook/svelte-vite';
import EquirectViewport from '@rosettadash/svelte/visual/media/equirect-viewport';

const meta: Meta<typeof EquirectViewport> = {
  title: 'Visual/Media/Equirect Viewport',
  component: EquirectViewport,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
