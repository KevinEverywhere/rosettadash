import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from '@rosettadash/react/layout/accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Layout/Accordion',
  component: Accordion,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    title: 'Resources',
  },
  render: (args) => (
    <Accordion {...args}>
      <p>Accordion body content.</p>
    </Accordion>
  ),
};

export const DefaultOpen: Story = {
  args: {
    title: 'Open by default',
    defaultOpen: true,
  },
  render: (args) => (
    <Accordion {...args}>
      <p>Visible on load.</p>
    </Accordion>
  ),
};
