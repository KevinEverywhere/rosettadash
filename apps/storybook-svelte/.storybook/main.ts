import type { StorybookConfig } from '@storybook/svelte-vite';
import { rosettadashStorybookFeatures } from '../../../tools/storybook-shared/storybook-features.ts';
import { rosettadashStorybookStories } from '../../../tools/storybook-shared/storybook-main-config.ts';
import { rosettadashSvelteViteFinal } from '../../../tools/storybook-shared/vite-final-svelte.ts';

const config: StorybookConfig = {
  stories: [...rosettadashStorybookStories],
  addons: ['@storybook/addon-docs', '@storybook/addon-links'],
  framework: {
    name: '@storybook/svelte-vite',
    options: {
      docgen: false,
    },
  },
  features: rosettadashStorybookFeatures,
  async viteFinal(viteConfig) {
    return rosettadashSvelteViteFinal(viteConfig);
  },
};

export default config;
