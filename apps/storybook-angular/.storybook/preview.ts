import type { Preview } from '@storybook/angular-vite';
import { registerRosettaDashElements } from '@rosettadash/web-components';
import '../../../tools/storybook-shared/rosettadash-preview.css';
import '../../../tools/storybook-shared/palette-catalog/palette-demo-styles.css';
import { rosettadashFrameworkPreviewParameters } from '../../../tools/storybook-shared/framework-preview.ts';
import { storybookTypographyParameters } from '../../../tools/storybook-shared/storybook-typography.ts';

registerRosettaDashElements();

const preview: Preview = {
  ...storybookTypographyParameters,
  parameters: {
    ...rosettadashFrameworkPreviewParameters,
    options: {
      storySort: {
        order: [
          'Getting Started',
          ['Start here', 'Component count', 'Styling modes'],
          'Catalog',
          ['Components', 'Meta components'],
        ],
        includeNames: true,
        method: 'alphabetical',
        locales: 'en-US',
      },
    },
  },
};

export default preview;
