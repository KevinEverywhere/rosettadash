import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Layout/Accordion',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Import: `@rosettadash/web-components/layout/accordion` — registers `<rd-accordion>`.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () =>
    `<rd-accordion title="Resources"><p>Accordion body content.</p></rd-accordion>`,
};

export const DefaultOpen: Story = {
  render: () =>
    `<rd-accordion title="Open by default" default-open><p>Visible on load.</p></rd-accordion>`,
};
