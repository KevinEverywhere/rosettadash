import type { ComponentPlugin } from './component-plugin';

const DEFAULT_INLINE_SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"',
  ' stroke="currentColor" stroke-width="2" aria-hidden="true">',
  '<circle cx="12" cy="12" r="10"/>',
  '<path d="M8 12l2 2 4-4"/>',
  '</svg>',
].join('');

const DEFAULT_ICON_SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">',
  '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/>',
  '</svg>',
].join('');

/** First-party SVG visual plugins (DAS-80). */
export const SVG_COMPONENT_PLUGINS: ComponentPlugin[] = [
  {
    id: 'svg.inline',
    definition: {
      type: 'visual.svg.inline',
      category: 'visual',
      label: 'SVG Inline',
      description: 'Render inline SVG markup, a remote URL, or a content-library asset path',
      isVisual: true,
      inputs: [{ id: 'row', name: 'row', dataType: 'row' }],
      outputs: [],
      properties: [
        {
          key: 'sourceMode',
          label: 'Source',
          type: 'select',
          default: 'inline',
          options: [
            { label: 'Inline markup', value: 'inline' },
            { label: 'Remote URL', value: 'url' },
            { label: 'Content library path', value: 'path' },
          ],
        },
        { key: 'markup', label: 'SVG markup', type: 'string', default: DEFAULT_INLINE_SVG },
        { key: 'url', label: 'SVG URL', type: 'string', default: '' },
        { key: 'assetPath', label: 'Asset path', type: 'string', default: '' },
        { key: 'width', label: 'Width (px)', type: 'number', default: 120 },
        { key: 'height', label: 'Height (px)', type: 'number', default: 120 },
        { key: 'ariaLabel', label: 'Accessible label', type: 'string', default: 'SVG graphic' },
        {
          key: 'preserveAspectRatio',
          label: 'Aspect ratio',
          type: 'select',
          default: 'xMidYMid meet',
          options: [
            { label: 'Meet (contain)', value: 'xMidYMid meet' },
            { label: 'Slice (cover)', value: 'xMidYMid slice' },
            { label: 'None', value: 'none' },
          ],
        },
        {
          key: 'fillField',
          label: 'Fill color field (row)',
          type: 'string',
          default: '',
        },
      ],
    },
    metadata: {
      paletteGroupId: 'svg-visuals',
      previewKind: 'plugin',
    },
  },
  {
    id: 'svg.icon',
    definition: {
      type: 'visual.svg.icon',
      category: 'visual',
      label: 'SVG Icon',
      description: 'Compact icon host with size and color styling',
      isVisual: true,
      inputs: [{ id: 'row', name: 'row', dataType: 'row' }],
      outputs: [],
      properties: [
        { key: 'markup', label: 'Icon markup', type: 'string', default: DEFAULT_ICON_SVG },
        { key: 'size', label: 'Size (px)', type: 'number', default: 24 },
        { key: 'color', label: 'Color', type: 'string', default: 'currentColor' },
        { key: 'title', label: 'Title', type: 'string', default: 'Icon' },
        { key: 'ariaLabel', label: 'Accessible label', type: 'string', default: '' },
        {
          key: 'colorField',
          label: 'Color field (row)',
          type: 'string',
          default: '',
        },
      ],
    },
    metadata: {
      paletteGroupId: 'svg-visuals',
      previewKind: 'plugin',
    },
  },
];
