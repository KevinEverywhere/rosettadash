/** Runtime catalog for Destination Atlas About page — proof apps and Storybook ports. */
export interface DestinationAtlasRuntimeGuide {
  id: string;
  label: string;
  npmPackage: string;
  ticket: string;
  proofPath: string;
  proofCommand: string;
  proofPort: number;
  storybookCommand: string;
  storybookPort: number;
  summary: string;
}

export const DESTINATION_ATLAS_RUNTIME_GUIDES: DestinationAtlasRuntimeGuide[] = [
  {
    id: 'web-components',
    label: 'Web Components (Custom Elements)',
    npmPackage: '@rosettadash/web-components',
    ticket: 'DAS-121',
    proofPath: 'apps/proof-web-components',
    proofCommand: 'npm run proof:web-components',
    proofPort: 4310,
    storybookCommand: 'npm run storybook:web-components',
    storybookPort: 6006,
    summary:
      'Shadow-DOM hosts and catalog elements. Use when exporting CE-first dashboards or embedding rd-* tags in any stack.',
  },
  {
    id: 'react',
    label: 'React',
    npmPackage: '@rosettadash/react',
    ticket: 'DAS-122',
    proofPath: 'apps/proof-react',
    proofCommand: 'npm run proof:react',
    proofPort: 4311,
    storybookCommand: 'npm run storybook:react',
    storybookPort: 6007,
    summary:
      'Native React wrappers with forwardRef hosts. This app is the reference UX for Destination Atlas — copy patterns into your React dashboard.',
  },
  {
    id: 'angular',
    label: 'Angular',
    npmPackage: '@rosettadash/angular',
    ticket: 'DAS-123',
    proofPath: 'apps/proof-angular',
    proofCommand: 'nx serve proof-angular',
    proofPort: 4312,
    storybookCommand: 'npm run storybook:angular',
    storybookPort: 6009,
    summary:
      'Standalone Angular components mirroring the React proof screens. Import from @rosettadash/angular subpaths per component.',
  },
  {
    id: 'vue',
    label: 'Vue',
    npmPackage: '@rosettadash/vue',
    ticket: 'DAS-124',
    proofPath: 'apps/proof-vue',
    proofCommand: 'nx serve proof-vue',
    proofPort: 4313,
    storybookCommand: 'npm run storybook:vue',
    storybookPort: 6008,
    summary:
      'Vue 3 SFC wrappers with the same Destination Atlas navigation and mock data as the React reference app.',
  },
  {
    id: 'svelte',
    label: 'Svelte',
    npmPackage: '@rosettadash/svelte',
    ticket: 'DAS-125',
    proofPath: 'apps/proof-svelte',
    proofCommand: 'nx serve proof-svelte',
    proofPort: 4314,
    storybookCommand: 'npm run storybook:svelte',
    storybookPort: 6010,
    summary:
      'Svelte 5 components generated from the shared taxonomy. Pair with Storybook for isolated visual review.',
  },
];

export const DESTINATION_ATLAS_ABOUT_INTRO = {
  title: 'Why Destination Atlas?',
  lead:
    'Destination Atlas is a functional demo — not a component kitchen sink. Each screen exercises real RosettaDash components the way you would wire them in production: filters bound to tables, maps with provider choice, role gates, media embeds, and advanced views.',
  proofPurpose:
    'The five proof apps (Web Components + four frameworks) share mock data from libs/destination-atlas and identical screen names. Compare runtime imports side-by-side, then open Storybook on the matching port to inspect components in isolation.',
  consumerInstall:
    'Install @rosettadash/core and the runtime package you need (@rosettadash/react, /angular, /vue, /svelte, or /web-components). See docs/39-npm-consumer-install.md for tarball and registry workflows.',
  runtimeCardsNote:
    'The Web Components, React, Angular, Vue, and Svelte blocks below are not RosettaDash palette components — they are npm runtime packages (delivery targets). Each card is proof-app documentation UI: plain layout markup styled for this About page. The actual reusable components live inside those packages (KpiCard, GeoMap, ScrollRegion, etc.) and appear on the other tabs and in Storybook.',
  componentSourceTitle: 'Component source panel',
  componentSourceBody:
    'Every screen, including About, shows a workbench with two panes. On the right, the Component source panel lists the React JSX for the active tab: screen component, imported RosettaDash wrappers, prop names, and nesting. Use it to copy composition patterns into your app. On narrow viewports, switch between Atlas preview and Component source with the toggle above the panes. About is the only tab without a source pane — you are reading the onboarding copy instead.',
};
