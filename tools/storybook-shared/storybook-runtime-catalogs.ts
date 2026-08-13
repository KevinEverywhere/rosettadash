export type StorybookRuntimeId = 'web-components' | 'react' | 'vue' | 'angular' | 'svelte';

export interface StorybookRuntimeCatalog {
  id: StorybookRuntimeId;
  label: string;
  packageName: string;
  storybookCommand: string;
  port: number;
  importHint: string;
}

export const STORYBOOK_RUNTIME_CATALOGS: Record<StorybookRuntimeId, StorybookRuntimeCatalog> = {
  'web-components': {
    id: 'web-components',
    label: 'Web components catalog',
    packageName: '@rosettadash/web-components',
    storybookCommand: 'npm run storybook:web-components',
    port: 6006,
    importHint: 'Custom elements and catalog CE hosts — register once via registerRosettaDashElements().',
  },
  react: {
    id: 'react',
    label: 'React catalog',
    packageName: '@rosettadash/react',
    storybookCommand: 'npm run storybook:react',
    port: 6007,
    importHint: 'Import paths follow @rosettadash/react/<group>/…/<component>. Media hosts wrap web components.',
  },
  vue: {
    id: 'vue',
    label: 'Vue catalog',
    packageName: '@rosettadash/vue',
    storybookCommand: 'npm run storybook:vue',
    port: 6008,
    importHint: 'Import paths follow @rosettadash/vue/<group>/…/<component>. Media hosts wrap web components.',
  },
  angular: {
    id: 'angular',
    label: 'Angular catalog',
    packageName: '@rosettadash/angular',
    storybookCommand: 'npm run storybook:angular',
    port: 6009,
    importHint: 'Import paths follow @rosettadash/angular/<group>/…/<component>. Media hosts wrap web components.',
  },
  svelte: {
    id: 'svelte',
    label: 'Svelte catalog',
    packageName: '@rosettadash/svelte',
    storybookCommand: 'npm run storybook:svelte',
    port: 6010,
    importHint: 'Import paths follow @rosettadash/svelte/<group>/…/<component>. Media hosts wrap web components.',
  },
};
