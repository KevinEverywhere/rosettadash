import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Accordion from '@rosettadash/svelte/layout/accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Layout/Accordion',
  component: Accordion,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Resources',
  },
};

export const DefaultOpen: Story = {
  args: {
    title: 'Open by default',
    defaultOpen: true,
  },
};
