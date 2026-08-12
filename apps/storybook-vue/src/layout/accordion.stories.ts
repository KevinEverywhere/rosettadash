import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Accordion } from '@rosettadash/vue/layout/accordion';

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
  render: (args) => ({
    components: { Accordion },
    setup: () => ({ args }),
    template: '<Accordion v-bind="args"><p>Accordion body content.</p></Accordion>',
  }),
};

export const DefaultOpen: Story = {
  args: {
    title: 'Open by default',
    defaultOpen: true,
  },
  render: (args) => ({
    components: { Accordion },
    setup: () => ({ args }),
    template: '<Accordion v-bind="args"><p>Visible on load.</p></Accordion>',
  }),
};
