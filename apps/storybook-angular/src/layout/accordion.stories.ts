import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Accordion } from '@rosettadash/angular/layout/accordion';

const meta: Meta<Accordion> = {
  title: 'Layout/Accordion',
  component: Accordion,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<Accordion>;

export const Default: Story = {
  args: {
    title: 'Resources',
  },
  render: (args) => ({
    props: args,
    template: `<rd-accordion [title]="title"><p>Accordion body content.</p></rd-accordion>`,
  }),
};

export const DefaultOpen: Story = {
  args: {
    title: 'Open by default',
    defaultOpen: true,
  },
  render: (args) => ({
    props: args,
    template: `<rd-accordion [title]="title" [defaultOpen]="defaultOpen"><p>Visible on load.</p></rd-accordion>`,
  }),
};
