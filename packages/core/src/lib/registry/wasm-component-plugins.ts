import type { ComponentPlugin } from './component-plugin';

const mediaOperationOptions = [
  { label: 'Transcode', value: 'transcode' },
  { label: 'Extract frame', value: 'extract-frame' },
  { label: 'Thumbnail', value: 'thumbnail' },
] as const;

const mediaInputOptions = [
  { label: 'File', value: 'file' },
  { label: 'Blob', value: 'blob' },
  { label: 'URL', value: 'url' },
] as const;

/** First-party WASM compute plugins (DAS-81). */
export const WASM_COMPONENT_PLUGINS: ComponentPlugin[] = [
  {
    id: 'wasm.asset',
    definition: {
      type: 'infra.wasm.asset',
      category: 'infra',
      label: 'WASM Asset',
      description: 'Content-library reference for a .wasm binary and glue JavaScript',
      isVisual: false,
      inputs: [],
      outputs: [{ id: 'asset-ref', name: 'assetRef', dataType: 'any' }],
      properties: [
        { key: 'modulePath', label: 'Module path', type: 'string', default: 'wasm/modules/example.wasm' },
        { key: 'gluePath', label: 'Glue JS path', type: 'string', default: 'wasm/glue/example.js' },
        { key: 'version', label: 'Version pin', type: 'string', default: '1' },
        { key: 'lazyLoad', label: 'Lazy load', type: 'boolean', default: true },
      ],
    },
    metadata: {
      paletteGroupId: 'wasm-compute',
      previewKind: 'plugin',
    },
  },
  {
    id: 'wasm.worker-host',
    definition: {
      type: 'visual.wasm.worker-host',
      category: 'visual',
      label: 'WASM Worker Host',
      description: 'Generic Web Worker wrapper for WASM modules with progress events',
      isVisual: true,
      inputs: [{ id: 'asset-ref', name: 'assetRef', dataType: 'any' }],
      outputs: [{ id: 'progress', name: 'progress', dataType: 'event' }],
      properties: [
        { key: 'workerScriptUrl', label: 'Worker script URL', type: 'string', default: '' },
        { key: 'moduleName', label: 'Module name', type: 'string', default: 'dash-wasm-worker' },
        { key: 'autoStart', label: 'Auto start', type: 'boolean', default: false },
        { key: 'showStatus', label: 'Show status UI', type: 'boolean', default: true },
      ],
    },
    metadata: {
      paletteGroupId: 'wasm-compute',
      previewKind: 'plugin',
    },
  },
  {
    id: 'wasm.module',
    definition: {
      type: 'visual.wasm.module',
      category: 'visual',
      label: 'WASM Module',
      description: 'Load and invoke a named WASM export with typed inputs and outputs',
      isVisual: true,
      inputs: [
        { id: 'asset-ref', name: 'assetRef', dataType: 'any' },
        { id: 'payload', name: 'payload', dataType: 'any' },
      ],
      outputs: [{ id: 'result', name: 'result', dataType: 'any' }],
      properties: [
        { key: 'entryExport', label: 'Entry export', type: 'string', default: 'run' },
        { key: 'memoryPages', label: 'Initial memory (pages)', type: 'number', default: 256 },
        { key: 'label', label: 'Label', type: 'string', default: 'WASM Module' },
      ],
    },
    metadata: {
      paletteGroupId: 'wasm-compute',
      previewKind: 'plugin',
    },
  },
  {
    id: 'wasm.media',
    definition: {
      type: 'visual.wasm.media',
      category: 'visual',
      label: 'WASM Media',
      description: 'ffmpeg.wasm-oriented media transcode host with progress and blob output',
      isVisual: true,
      inputs: [
        { id: 'asset-ref', name: 'assetRef', dataType: 'any' },
        { id: 'input-file', name: 'inputFile', dataType: 'any' },
      ],
      outputs: [
        { id: 'output-blob', name: 'outputBlob', dataType: 'any' },
        { id: 'progress', name: 'progress', dataType: 'event' },
        { id: 'metadata', name: 'metadata', dataType: 'rowset' },
      ],
      properties: [
        {
          key: 'operation',
          label: 'Operation',
          type: 'select',
          default: 'transcode',
          options: [...mediaOperationOptions],
        },
        {
          key: 'inputSource',
          label: 'Input source',
          type: 'select',
          default: 'file',
          options: [...mediaInputOptions],
        },
        { key: 'outputFormat', label: 'Output format', type: 'string', default: 'mp4' },
        { key: 'ffmpegArgs', label: 'ffmpeg args', type: 'string', default: '' },
        { key: 'showProgress', label: 'Show progress UI', type: 'boolean', default: true },
        { key: 'label', label: 'Label', type: 'string', default: 'Media transcode' },
      ],
    },
    metadata: {
      paletteGroupId: 'wasm-compute',
      previewKind: 'plugin',
    },
  },
];
