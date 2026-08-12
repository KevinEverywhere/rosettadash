import type { Meta, StoryObj } from '@storybook/svelte-vite';

const meta: Meta = {
  title: 'Getting Started/Introduction',
  parameters: {
    docs: {
      description: {
        component:
          'RosettaDash **Svelte** runtime catalog. Import paths follow `@rosettadash/svelte/<group>/…/<component>`.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  render: () =>
    `<div style="max-width: 40rem; line-height: 1.5">
      <h2 style="margin-top:0">Svelte catalog</h2>
      <p>Ships Svelte 5 source. Accordion supports <code>bind:open</code>.</p>
    </div>`,
};
