import type { Meta, StoryObj } from '@storybook/react-vite';
import { EquirectViewport } from '@rosettadash/react/visual/media/equirect-viewport';

const meta: Meta<typeof EquirectViewport> = {
  title: 'Visual/Media/Equirect Viewport',
  component: EquirectViewport,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof EquirectViewport>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <EquirectViewport
      {...args}
      style={{
        display: 'block',
        width: '100%',
        maxWidth: '32rem',
        height: '16rem',
        border: '1px solid var(--rd-color-border, #ccc)',
        borderRadius: '8px',
      }}
    />
  ),
};
