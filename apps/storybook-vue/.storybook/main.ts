import type { StorybookConfig } from '@storybook/vue3-vite';
import { rosettadashViteFinal } from '../../../tools/storybook-shared/vite-final.ts';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|ts)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-links'],
  framework: '@storybook/vue3-vite',
  async viteFinal(viteConfig) {
    return rosettadashViteFinal(viteConfig);
  },
};

export default config;
