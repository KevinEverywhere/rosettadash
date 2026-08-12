import type { ComponentPlugin } from './component-plugin';

/** Example first-party plugins registered through the SDK (not part of the P0 seed list). */
export const EXTENSION_COMPONENT_PLUGINS: ComponentPlugin[] = [
  {
    id: 'plugin.status-badge',
    definition: {
      type: 'visual.plugin.status-badge',
      category: 'visual',
      label: 'Status Badge',
      description: 'Compact status pill for dashboards (plugin SDK demo)',
      isVisual: true,
      inputs: [],
      outputs: [{ id: 'value', name: 'value', dataType: 'string' }],
      properties: [
        { key: 'label', label: 'Label', type: 'string', default: 'Active' },
        {
          key: 'tone',
          label: 'Tone',
          type: 'select',
          default: 'info',
          options: [
            { label: 'Info', value: 'info' },
            { label: 'Success', value: 'success' },
            { label: 'Warning', value: 'warning' },
          ],
        },
      ],
    },
    metadata: {
      paletteGroupId: 'plugin-extensions',
      previewKind: 'plugin',
    },
  },
  {
    id: 'plugin.metric-chip',
    definition: {
      type: 'visual.plugin.metric-chip',
      category: 'visual',
      label: 'Metric Chip',
      description: 'Inline metric highlight chip (plugin SDK demo)',
      isVisual: true,
      inputs: [{ id: 'value', name: 'value', dataType: 'number' }],
      outputs: [],
      properties: [
        { key: 'label', label: 'Label', type: 'string', default: 'Metric' },
        { key: 'value', label: 'Value', type: 'number', default: 0 },
        { key: 'suffix', label: 'Suffix', type: 'string', default: '' },
      ],
    },
    metadata: {
      paletteGroupId: 'plugin-extensions',
      previewKind: 'plugin',
    },
  },
];
