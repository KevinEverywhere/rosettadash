import type { StorybookConfig } from '@storybook/svelte-vite';
import { rosettadashSvelteViteFinal } from '../../../tools/storybook-shared/vite-final-svelte.ts';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|ts)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-links'],
  framework: {
    name: '@storybook/svelte-vite',
    options: {
      docgen: false,
    },
  },
  async viteFinal(viteConfig) {
    return rosettadashSvelteViteFinal(viteConfig);
  },
};

export default config;
