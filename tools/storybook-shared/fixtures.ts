/** Shared demo data for RosettaDash Storybook catalogs. */

export interface StoryLinkItem {
  label: string;
  href: string;
}

/** Primary nav — 10 items (sidebar / header menus). */
export const navigationLinkItems: StoryLinkItem[] = [
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Reports', href: '#reports' },
  { label: 'Customers', href: '#customers' },
  { label: 'Orders', href: '#orders' },
  { label: 'Inventory', href: '#inventory' },
  { label: 'Billing', href: '#billing' },
  { label: 'Team settings', href: '#team-settings' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Help center', href: '#help' },
];

/** Documentation TOC — 8 in-page sections. */
export const documentationTocItems: StoryLinkItem[] = [
  { label: 'Introduction', href: '#introduction' },
  { label: 'Installation', href: '#installation' },
  { label: 'Quick start', href: '#quick-start' },
  { label: 'Component taxonomy', href: '#taxonomy' },
  { label: 'Styling tokens', href: '#tokens' },
  { label: 'Media pipeline', href: '#media-pipeline' },
  { label: 'Export bundles', href: '#export' },
  { label: 'Troubleshooting', href: '#troubleshooting' },
];

/** External resources with longer labels. */
export const externalResourceItems: StoryLinkItem[] = [
  { label: 'RosettaDash GitHub repository', href: 'https://github.com/KevinEverywhere/rosettadash' },
  { label: 'npm — @rosettadash/web-components', href: 'https://www.npmjs.com/package/@rosettadash/web-components' },
  { label: 'Storybook component catalog (DAS-98)', href: '#storybook' },
  { label: 'FFmpeg equirect filter reference', href: 'https://ffmpeg.org/ffmpeg-filters.html' },
  { label: 'Web Components MDN guide', href: 'https://developer.mozilla.org/en-US/docs/Web/Web_Components' },
  { label: 'Three.js equirectangular mapping', href: 'https://threejs.org/docs/#api/en/materials/MeshBasicMaterial' },
  { label: 'Planet Kevin — author site', href: 'https://planetkevin.com' },
  { label: 'Issue tracker', href: 'https://planetkevin.atlassian.net/browse/DAS' },
];

/** @deprecated Use navigationLinkItems or documentationTocItems */
export const sampleLinkItems = documentationTocItems.slice(0, 3);

export const navigationLinkItemsJson = JSON.stringify(navigationLinkItems);
export const documentationTocItemsJson = JSON.stringify(documentationTocItems);
export const externalResourceItemsJson = JSON.stringify(externalResourceItems);

/** @deprecated */
export const sampleLinkItemsJson = JSON.stringify(sampleLinkItems);

export const equirectSource4K = {
  sourceWidth: 3840,
  sourceHeight: 1920,
  outputWidth: 1920,
  outputHeight: 1080,
} as const;

export const equirectSource6K = {
  sourceWidth: 5760,
  sourceHeight: 2880,
  outputWidth: 1280,
  outputHeight: 720,
} as const;

export const flatCropPresetCenter = {
  cropX: 960,
  cropY: 480,
  cropWidth: 1920,
  cropHeight: 960,
} as const;

export const flatCropPresetLeftThird = {
  cropX: 0,
  cropY: 240,
  cropWidth: 1280,
  cropHeight: 720,
} as const;

export const rectilinearPresetProgram = {
  yaw: 35,
  pitch: -12,
  horizontalFov: 75,
} as const;

export const rectilinearPresetWide = {
  yaw: -20,
  pitch: 8,
  horizontalFov: 110,
} as const;

export const accordionSectionCopy = {
  gettingStarted:
    'RosettaDash ships opt-in `--rd-*` tokens and `.rd-*` layout classes. Register custom elements once, then compose atoms in HTML or your framework runtime.',
  mediaPipeline:
    'Pair `<rd-video-source>` ingest with `<rd-equirect-viewport>` crop metadata. Filter strings come from `@rosettadash/core` — do not reimplement FFmpeg math in host apps.',
  recipes:
    'Recipes such as `<rd-accordion-link-list>` combine layout + visual atoms. Prefer composition when possible; use recipe elements when a single tag improves DX.',
} as const;
