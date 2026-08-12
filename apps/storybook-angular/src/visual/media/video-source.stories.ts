import type { Meta, StoryObj } from '@storybook/angular-vite';
import { VideoSource } from '@rosettadash/angular/visual/media/video-source';

const meta: Meta<VideoSource> = {
  title: 'Visual/Media/Video Source',
  component: VideoSource,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<VideoSource>;

export const Default: Story = {
  args: {
    label: 'Choose a video file',
    accept: 'video/*',
  },
};
