import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Visual/Media/Equirect Viewport',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Import: `@rosettadash/web-components/visual/media/equirect-viewport` — registers `<rd-equirect-viewport>`.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () =>
    `<rd-equirect-viewport style="display:block;width:100%;max-width:32rem;height:16rem;border:1px solid var(--rd-color-border, #ccc);border-radius:8px;"></rd-equirect-viewport>`,
};
