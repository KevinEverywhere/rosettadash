import type { Meta, StoryObj } from '@storybook/react-vite';
import { VideoSource } from '@rosettadash/react/visual/media/video-source';

const meta: Meta<typeof VideoSource> = {
  title: 'Visual/Media/Video Source',
  component: VideoSource,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof VideoSource>;

export const Default: Story = {
  args: {
    label: 'Choose a video file',
    accept: 'video/*',
  },
};
