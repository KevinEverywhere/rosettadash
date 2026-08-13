import type { Preview } from '@storybook/web-components-vite';
import { registerRosettaDashElements } from '@rosettadash/web-components';
import '../../../tools/storybook-shared/rosettadash-preview.css';
import '../../../tools/storybook-shared/palette-catalog/palette-demo-styles.css';
import { storybookTypographyParameters } from '../../../tools/storybook-shared/storybook-typography.ts';

registerRosettaDashElements();

const preview: Preview = {
  ...storybookTypographyParameters,
  parameters: {
    layout: 'padded',
    options: {
      storySort: {
        order: ['Getting Started', 'Catalog', ['Palette', 'Meta compositions']],
      },
    },
  },
};

export default preview;
