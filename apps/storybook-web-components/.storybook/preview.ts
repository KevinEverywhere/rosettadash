import type { Preview } from '@storybook/web-components-vite';
import { registerRosettaDashElements } from '@rosettadash/web-components';
import '../../../tools/storybook-shared/rosettadash-preview.css';

registerRosettaDashElements();

const preview: Preview = {
  parameters: {
    layout: 'padded',
    options: {
      storySort: {
        order: [
          'Getting Started',
          'Layout',
          'Visual',
          ['Link List', 'Media'],
          'Recipes',
        ],
      },
    },
  },
};

export default preview;
