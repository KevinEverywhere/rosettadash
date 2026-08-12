import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Getting Started/Introduction',
  parameters: {
    docs: {
      description: {
        component:
          'RosettaDash **React** runtime catalog. Import paths follow `@rosettadash/react/<group>/…/<component>`.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  render: () => (
    <div style={{ maxWidth: '40rem', lineHeight: 1.5 }}>
      <h2 style={{ marginTop: 0 }}>React catalog</h2>
      <p>
        Sidebar groups mirror the component taxonomy. Media components wrap web-component hosts
        from <code>@rosettadash/web-components</code>.
      </p>
    </div>
  ),
};
