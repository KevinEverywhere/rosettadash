import type { StorybookConfig } from '@storybook/angular-vite';
import { rosettadashViteFinal } from '../../../tools/storybook-shared/vite-final.ts';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|ts)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-links'],
  framework: {
    name: '@storybook/angular-vite',
    options: {
      compodoc: false,
    },
  },
  async viteFinal(viteConfig) {
    return rosettadashViteFinal(viteConfig);
  },
};

export default config;
