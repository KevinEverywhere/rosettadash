/** Shared demo data for RosettaDash Storybook catalogs. */
export const sampleLinkItems = [
  { label: 'Overview', href: '#overview' },
  { label: 'API reference', href: '#api' },
  { label: 'Examples', href: '#examples' },
] as const;

export const sampleLinkItemsJson = JSON.stringify(sampleLinkItems);
