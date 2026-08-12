import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta = {
  title: 'Getting Started/Introduction',
  parameters: {
    docs: {
      description: {
        component:
          'RosettaDash **Vue** runtime catalog. Import paths follow `@rosettadash/vue/<group>/…/<component>`.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  render: () => ({
    template: `
      <div style="max-width: 40rem; line-height: 1.5">
        <h2 style="margin-top:0">Vue catalog</h2>
        <p>Sidebar groups mirror the component taxonomy. Accordion supports <code>v-model:open</code>.</p>
      </div>
    `,
  }),
};
