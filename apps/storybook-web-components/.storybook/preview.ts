import type { Preview } from '@storybook/web-components-vite';
import { registerRosettaDashElements } from '@rosettadash/web-components';
import '../../../tools/storybook-shared/rosettadash-preview.css';
import '../../../tools/storybook-shared/palette-catalog/palette-demo-styles.css';

registerRosettaDashElements();

const preview: Preview = {
  parameters: {
    layout: 'padded',
    options: {
      storySort: {
        order: [
          'Getting Started',
          'Catalog',
          ['Palette', 'Meta compositions'],
          'Layout',
          'Visual',
          ['Link List', 'Media'],
          'Recipes',
          'Wasm',
        ],
      },
    },
  },
};

export default preview;
