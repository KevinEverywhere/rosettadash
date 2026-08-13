import {
  STORYBOOK_RUNTIME_CATALOGS,
  type StorybookRuntimeId,
} from '../storybook-runtime-catalogs.js';

export interface StylingModeStack {
  title: string;
  body: string;
}

export interface StylingModesRuntimeCopy {
  eyebrow: string;
  stacksIntro: string;
  minimalImport: string;
  tokensImport: string;
  themedImport: string;
  hostProp: string;
  checklistHostLine: string;
  stacks: StylingModeStack[];
}

const BASE_STACKS: StylingModeStack[] = [
  {
    title: 'Tailwind CSS',
    body: 'Put utilities on components or map rd-* blocks in @layer components — same classnames, your design tokens.',
  },
  {
    title: 'Plain CSS',
    body: 'Target .rd-accordion and .rd-link-list in your global sheet. No build plugin required.',
  },
  {
    title: 'Custom elements',
    body: 'Import tokens.css + styles.css once; framework wrappers and <rd-*> hosts share the same look.',
  },
];

const RUNTIME_COPY: Record<StorybookRuntimeId, StylingModesRuntimeCopy> = {
  react: {
    eyebrow: 'React runtime',
    stacksIntro:
      'RosettaDash does not lock you into one CSS approach. The builder records your stack profile; these patterns are what we generate and document for React apps.',
    minimalImport: 'npm i @rosettadash/react\n// no CSS import',
    tokensImport:
      "import '@rosettadash/web-components/tokens.css';\n\n/* your rules using var(--rd-color-accent) */",
    themedImport:
      "import '@rosettadash/web-components/tokens.css';\nimport '@rosettadash/web-components/styles.css';",
    hostProp: 'className',
    checklistHostLine:
      'For media and WASM hosts, pass <code>className</code> and set <code>--rd-*</code> on the host when not using the global theme.',
    stacks: [
      ...BASE_STACKS.slice(0, 2),
      {
        title: 'CSS Modules',
        body: 'Scope your layout with :global(.rd-accordion__header) inside a module root.',
      },
      {
        title: 'MUI / design systems',
        body: 'Map theme.palette to --rd-color-accent on a wrapper. Native React primitives inherit your stack.',
      },
      {
        title: 'styled-components',
        body: 'Wrap Accordion in a styled host or pass className — markup stays stable rd-* for exports.',
      },
      BASE_STACKS[2],
    ],
  },
  vue: {
    eyebrow: 'Vue runtime',
    stacksIntro:
      'Vue SFCs stay stack-agnostic. Import as much or as little RosettaDash CSS as you want — or style rd-* blocks with your existing toolchain.',
    minimalImport: 'npm i @rosettadash/vue\n// no CSS import',
    tokensImport:
      "import '@rosettadash/web-components/tokens.css';\n\n/* your rules using var(--rd-color-accent) */",
    themedImport:
      "import '@rosettadash/web-components/tokens.css';\nimport '@rosettadash/web-components/styles.css';",
    hostProp: 'class',
    checklistHostLine:
      'For media and WASM hosts, pass <code>class</code> and set <code>--rd-*</code> on the host when not using the global theme.',
    stacks: [
      ...BASE_STACKS.slice(0, 2),
      {
        title: 'Scoped SFC styles',
        body: 'Use :deep(.rd-accordion__header) in <style scoped> to reach stable rd-* blocks without leaking globals.',
      },
      {
        title: 'Vuetify / component libraries',
        body: 'Keep RosettaDash for dashboard primitives; map --rd-color-accent to your library theme on a wrapper.',
      },
      BASE_STACKS[2],
    ],
  },
  angular: {
    eyebrow: 'Angular runtime',
    stacksIntro:
      'Standalone Angular components expose the same rd-* contract as web components. Pair with global CSS, tokens, or your Material theme.',
    minimalImport: 'npm i @rosettadash/angular\n// no CSS import',
    tokensImport:
      "/* angular.json styles array */\n\"node_modules/@rosettadash/web-components/tokens.css\"",
    themedImport:
      '"node_modules/@rosettadash/web-components/tokens.css",\n"node_modules/@rosettadash/web-components/styles.css"',
    hostProp: 'class',
    checklistHostLine:
      'For media and WASM hosts, pass <code>class</code> and set <code>--rd-*</code> on the host when not using the global theme.',
    stacks: [
      ...BASE_STACKS.slice(0, 2),
      {
        title: 'Component styles',
        body: 'Add rd-* overrides in a standalone component stylesheet or use global styles in angular.json.',
      },
      {
        title: 'Angular Material',
        body: 'Map Material palette tokens to --rd-color-accent on a host div wrapping rd-* components.',
      },
      BASE_STACKS[2],
    ],
  },
  svelte: {
    eyebrow: 'Svelte runtime',
    stacksIntro:
      'Svelte 5 components compile to the same rd-* markup. Style with global CSS, tokens, or :global() in component blocks.',
    minimalImport: 'npm i @rosettadash/svelte\n// no CSS import',
    tokensImport:
      "import '@rosettadash/web-components/tokens.css';\n\n/* your rules using var(--rd-color-accent) */",
    themedImport:
      "import '@rosettadash/web-components/tokens.css';\nimport '@rosettadash/web-components/styles.css';",
    hostProp: 'class',
    checklistHostLine:
      'For media and WASM hosts, pass <code>class</code> and set <code>--rd-*</code> on the host when not using the global theme.',
    stacks: [
      ...BASE_STACKS.slice(0, 2),
      {
        title: 'Component :global()',
        body: 'Reach rd-* blocks from a Svelte <style> block with :global(.rd-link-list__link) { … }.',
      },
      {
        title: 'Tailwind + SvelteKit',
        body: 'Apply utilities on Accordion/LinkList hosts — light-DOM Svelte components inherit ancestor classes.',
      },
      BASE_STACKS[2],
    ],
  },
  'web-components': {
    eyebrow: 'Web components runtime',
    stacksIntro:
      'Custom elements use shadow DOM for internal chrome. Import tokens or the full stylesheet; pass --rd-* on the host to rebrand.',
    minimalImport: 'registerRosettaDashElements();\n// no CSS import — style via ::part or host vars',
    tokensImport:
      "import '@rosettadash/web-components/tokens.css';\n\n/* styleLightDOM helpers or host { --rd-color-accent: … } */",
    themedImport:
      "import '@rosettadash/web-components/tokens.css';\nimport '@rosettadash/web-components/styles.css';",
    hostProp: 'class',
    checklistHostLine:
      'Set <code>--rd-*</code> CSS variables on each <code>&lt;rd-*&gt;</code> host to rebrand shadow internals without forking templates.',
    stacks: [
      {
        title: 'Host variables',
        body: 'Override --rd-color-accent, --rd-radius-md, etc. on the element — shadow styles consume the same tokens.',
      },
      {
        title: 'Plain CSS (light DOM)',
        body: 'Catalog CE hosts and slotted content use rd-* in light DOM — style with familiar global selectors.',
      },
      {
        title: 'Framework apps',
        body: 'React, Vue, Angular, and Svelte wrappers delegate to these elements — one theme import covers all.',
      },
      {
        title: 'Register once',
        body: 'Call registerRosettaDashElements() at app bootstrap before rendering any rd-* tags.',
      },
    ],
  },
};

export function stylingModesCopy(runtimeId: StorybookRuntimeId): StylingModesRuntimeCopy {
  const runtime = STORYBOOK_RUNTIME_CATALOGS[runtimeId];
  const copy = RUNTIME_COPY[runtimeId];
  return {
    ...copy,
    eyebrow: `${runtime.label.replace(' catalog', '')} · styling`,
  };
}
