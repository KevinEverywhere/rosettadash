import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { mountFullPaletteCatalog } from '../../../../tools/storybook-shared/palette-catalog/mount-palette-catalog';

const meta: Meta = {
  title: 'Getting Started/Introduction',
  parameters: {
    docs: {
      description: {
        component:
          'RosettaDash component catalog — **Catalog → Palette** lists every builder component (~50 types across 14 groups). Atom stories document shipped `<rd-*>` npm elements.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const StartHere: Story = {
  name: 'Start here',
  render: () =>
    `<div style="max-width: 44rem; line-height: 1.55; font-size: 0.9375rem;">
      <h2 style="margin-top:0">RosettaDash Storybook</h2>
      <ol>
        <li><strong>Catalog → Palette → All components</strong> — full builder mirror (~50 components)</li>
        <li><strong>Catalog → Palette → [group]</strong> — Form Inputs, Charts, VR &amp; 3D, Media, …</li>
        <li><strong>Layout / Visual / Wasm</strong> — deep dives on shipped npm custom elements</li>
      </ol>
      <p>Run: <code>npm run storybook:web-components</code> (port 6006)</p>
    </div>`,
};

export const ComponentCount: Story = {
  render: () => {
    const root = document.createElement('div');
    root.style.maxWidth = '44rem';
    root.style.fontSize = '0.875rem';
    root.innerHTML =
      '<p>Loading component index…</p><p style="color:var(--rd-color-muted,#6b7280)">Open <strong>Catalog → All components</strong> for the live gallery.</p>';
    return root;
  },
};

void mountFullPaletteCatalog;
