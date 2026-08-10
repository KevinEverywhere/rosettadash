import type { ComponentPlugin } from './component-plugin';

const cameraPresetOptions = [
  { label: 'Orbit', value: 'orbit' },
  { label: 'Front', value: 'front' },
  { label: 'Isometric', value: 'iso' },
] as const;

const sharedSceneProperties = [
  { key: 'title', label: 'Title', type: 'string' as const, default: '3D View' },
  {
    key: 'backgroundColor',
    label: 'Background',
    type: 'string' as const,
    default: '#0f172a',
  },
  {
    key: 'cameraPreset',
    label: 'Camera preset',
    type: 'select' as const,
    default: 'orbit',
    options: [...cameraPresetOptions],
  },
  { key: 'autoRotate', label: 'Auto rotate', type: 'boolean' as const, default: false },
];

const rowsetChartInputs = [
  { id: 'data', name: 'data', dataType: 'rowset' as const, required: true },
  { id: 'range', name: 'range', dataType: 'date-range' as const },
];

/** First-party VR / 3D display plugins (DAS-56). */
export const VR_COMPONENT_PLUGINS: ComponentPlugin[] = [
  {
    id: 'display.3d-bar-chart',
    definition: {
      type: 'visual.display.3d-bar-chart',
      category: 'visual',
      label: '3D Bar Chart',
      description: 'Categorical metrics rendered as 3D bars with orbit controls',
      isVisual: true,
      inputs: rowsetChartInputs,
      outputs: [],
      properties: [
        ...sharedSceneProperties.map((property) =>
          property.key === 'title' ? { ...property, default: '3D Bar Chart' } : property,
        ),
        { key: 'xField', label: 'X field', type: 'string', default: 'label' },
        { key: 'yField', label: 'Y field', type: 'string', default: 'value' },
      ],
    },
    metadata: {
      paletteGroupId: 'vr-visuals',
      previewKind: 'plugin',
    },
  },
  {
    id: 'display.3d-scatter',
    definition: {
      type: 'visual.display.3d-scatter',
      category: 'visual',
      label: '3D Scatter Plot',
      description: 'Rowset points plotted in 3D space',
      isVisual: true,
      inputs: rowsetChartInputs,
      outputs: [],
      properties: [
        ...sharedSceneProperties.map((property) =>
          property.key === 'title' ? { ...property, default: '3D Scatter Plot' } : property,
        ),
        { key: 'xField', label: 'X field', type: 'string', default: 'x' },
        { key: 'yField', label: 'Y field', type: 'string', default: 'y' },
        { key: 'zField', label: 'Z field', type: 'string', default: 'value' },
      ],
    },
    metadata: {
      paletteGroupId: 'vr-visuals',
      previewKind: 'plugin',
    },
  },
  {
    id: 'display.3d-scene',
    definition: {
      type: 'visual.display.3d-scene',
      category: 'visual',
      label: '3D Scene',
      description: 'Orbitable 3D scene host for spatial dashboards',
      isVisual: true,
      inputs: [{ id: 'data', name: 'data', dataType: 'rowset' }],
      outputs: [],
      properties: [
        ...sharedSceneProperties.map((property) =>
          property.key === 'title' ? { ...property, default: '3D Scene' } : property,
        ),
        { key: 'showGrid', label: 'Show grid', type: 'boolean', default: true },
      ],
    },
    metadata: {
      paletteGroupId: 'vr-visuals',
      previewKind: 'plugin',
    },
  },
];

export const VR_ROWSET_VISUAL_TYPES = VR_COMPONENT_PLUGINS.map(
  (plugin) => plugin.definition.type,
);

export function isVrRowsetVisualType(type: string): boolean {
  return (
    type === 'visual.display.3d-bar-chart' ||
    type === 'visual.display.3d-scatter' ||
    type === 'visual.display.3d-scene'
  );
}

export function isVrChartDataType(type: string): boolean {
  return type === 'visual.display.3d-bar-chart' || type === 'visual.display.3d-scatter';
}
