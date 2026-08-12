import type { ComponentPlugin } from './component-plugin';

/** News finder domain components for voice/AI-driven dashboard builds (DAS-75). */
export const NEWS_COMPONENT_PLUGINS: ComponentPlugin[] = [
  {
    id: 'news.language-select',
    definition: {
      type: 'visual.news.language-select',
      category: 'visual',
      label: 'News Language',
      description: 'Language selector for news search (e.g. English, Spanish, French)',
      isVisual: true,
      inputs: [{ id: 'options', name: 'options', dataType: 'rowset' }],
      outputs: [{ id: 'value', name: 'value', dataType: 'string' }],
      properties: [
        { key: 'placeholder', label: 'Placeholder', type: 'string', default: 'Language' },
        {
          key: 'defaultLanguage',
          label: 'Default language',
          type: 'select',
          default: 'en',
          options: [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
            { label: 'German', value: 'de' },
          ],
        },
      ],
    },
    metadata: { paletteGroupId: 'news-discovery', previewKind: 'builtin' },
  },
  {
    id: 'news.region-select',
    definition: {
      type: 'visual.news.region-select',
      category: 'visual',
      label: 'News Region',
      description: 'Region or country selector for localized news',
      isVisual: true,
      inputs: [{ id: 'options', name: 'options', dataType: 'rowset' }],
      outputs: [{ id: 'value', name: 'value', dataType: 'string' }],
      properties: [
        { key: 'placeholder', label: 'Placeholder', type: 'string', default: 'Region' },
        {
          key: 'defaultRegion',
          label: 'Default region',
          type: 'select',
          default: 'us',
          options: [
            { label: 'United States', value: 'us' },
            { label: 'United Kingdom', value: 'uk' },
            { label: 'European Union', value: 'eu' },
            { label: 'Global', value: 'global' },
          ],
        },
      ],
    },
    metadata: { paletteGroupId: 'news-discovery', previewKind: 'builtin' },
  },
  {
    id: 'news.type-select',
    definition: {
      type: 'visual.news.type-select',
      category: 'visual',
      label: 'News Type',
      description: 'Category filter — headlines, business, tech, sports, etc.',
      isVisual: true,
      inputs: [{ id: 'options', name: 'options', dataType: 'rowset' }],
      outputs: [{ id: 'value', name: 'value', dataType: 'string' }],
      properties: [
        { key: 'placeholder', label: 'Placeholder', type: 'string', default: 'News type' },
        {
          key: 'defaultType',
          label: 'Default type',
          type: 'select',
          default: 'headlines',
          options: [
            { label: 'Headlines', value: 'headlines' },
            { label: 'Business', value: 'business' },
            { label: 'Technology', value: 'technology' },
            { label: 'Sports', value: 'sports' },
            { label: 'Science', value: 'science' },
          ],
        },
      ],
    },
    metadata: { paletteGroupId: 'news-discovery', previewKind: 'builtin' },
  },
  {
    id: 'news.search-box',
    definition: {
      type: 'visual.news.search-box',
      category: 'visual',
      label: 'News Search',
      description: 'Keyword search box for news queries',
      isVisual: true,
      inputs: [],
      outputs: [
        { id: 'query', name: 'query', dataType: 'string' },
        { id: 'search', name: 'search', dataType: 'event' },
      ],
      properties: [
        { key: 'placeholder', label: 'Placeholder', type: 'string', default: 'Search news…' },
        { key: 'buttonLabel', label: 'Button label', type: 'string', default: 'Search' },
      ],
    },
    metadata: { paletteGroupId: 'news-discovery', previewKind: 'builtin' },
  },
  {
    id: 'news.results-table',
    definition: {
      type: 'visual.news.results-table',
      category: 'visual',
      label: 'News Results',
      description: 'Table of headlines with source, region, and published time',
      isVisual: true,
      inputs: [
        { id: 'data', name: 'data', dataType: 'rowset', required: true },
        { id: 'filter', name: 'filter', dataType: 'string' },
      ],
      outputs: [
        { id: 'row-select', name: 'rowSelect', dataType: 'event' },
        { id: 'selected-row', name: 'selectedRow', dataType: 'row' },
      ],
      properties: [
        { key: 'pageSize', label: 'Page size', type: 'number', default: 20 },
        { key: 'showSource', label: 'Show source column', type: 'boolean', default: true },
        { key: 'showPublishedAt', label: 'Show date column', type: 'boolean', default: true },
      ],
    },
    metadata: { paletteGroupId: 'news-discovery', previewKind: 'builtin' },
  },
  {
    id: 'news.article-detail',
    definition: {
      type: 'visual.news.article-detail',
      category: 'visual',
      label: 'Article Detail',
      description: 'Full article view for a selected news row',
      isVisual: true,
      inputs: [{ id: 'row', name: 'row', dataType: 'row', required: true }],
      outputs: [],
      properties: [
        { key: 'showSummary', label: 'Show summary', type: 'boolean', default: true },
        { key: 'showUrl', label: 'Show source URL', type: 'boolean', default: true },
      ],
    },
    metadata: { paletteGroupId: 'news-discovery', previewKind: 'builtin' },
  },
];
