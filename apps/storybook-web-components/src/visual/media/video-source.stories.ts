import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Visual/Media/Video Source',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Import: `@rosettadash/web-components/visual/media/video-source` — registers `<rd-video-source>`.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () =>
    `<rd-video-source label="Choose a video file" accept="video/*"></rd-video-source>`,
};
