import type { Preview } from '@storybook/react-vite';
import '../../../tools/storybook-shared/rosettadash-preview.css';

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
