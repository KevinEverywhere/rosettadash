import type { Meta, StoryObj } from '@storybook/angular-vite';

const meta: Meta = {
  title: 'Getting Started/Introduction',
  parameters: {
    docs: {
      description: {
        component:
          'RosettaDash **Angular** runtime catalog. Import paths follow `@rosettadash/angular/<group>/…/<component>`.',
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
        <h2 style="margin-top:0">Angular catalog</h2>
        <p>Standalone components with signal inputs. Accordion supports <code>[(open)]</code>.</p>
      </div>
    `,
  }),
};
