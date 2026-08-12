import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Getting Started/Introduction',
  parameters: {
    docs: {
      description: {
        component:
          'RosettaDash **web-components** runtime catalog. Import paths follow `@rosettadash/web-components/<group>/…/<component>`. Opt-in `--rd-*` styling is loaded globally in preview.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  render: () =>
    `<div style="max-width: 40rem; line-height: 1.5">
      <h2 style="margin-top:0">Web Components catalog</h2>
      <p>Sidebar groups mirror the component taxonomy: Layout, Visual, Visual/Media, and Recipes.</p>
      <p>Toggle RosettaDash chrome via <code>@rosettadash/web-components/tokens.css</code> and <code>styles.css</code> (already applied here).</p>
    </div>`,
};
