import type { ComponentRegistry } from '../registry/component-registry';
import { defaultComponentRegistry } from '../registry/component-registry';
import type { Composite } from '../model/types';
import { NEWS_FINDER_TEMPLATE_ID } from './news-finder-template-id';
import type { BuildCompositeTemplateOptions } from './template-types';

export function buildNewsFinderComposite(
  registry: ComponentRegistry = defaultComponentRegistry,
  options: BuildCompositeTemplateOptions = {},
): Composite {
  const language = registry.createNode('visual.news.language-select', {
    id: 'news-language',
    label: 'Language',
    layout: { x: 24, y: 24, width: 180, height: 72 },
  });

  const region = registry.createNode('visual.news.region-select', {
    id: 'news-region',
    label: 'Region',
    layout: { x: 220, y: 24, width: 180, height: 72 },
  });

  const newsType = registry.createNode('visual.news.type-select', {
    id: 'news-type',
    label: 'News type',
    layout: { x: 416, y: 24, width: 180, height: 72 },
  });

  const search = registry.createNode('visual.news.search-box', {
    id: 'news-search',
    label: 'Search',
    layout: { x: 24, y: 112, width: 572, height: 72 },
    properties: { placeholder: 'Search headlines, topics, or sources…' },
  });

  const results = registry.createNode('visual.news.results-table', {
    id: 'news-results',
    label: 'Results',
    layout: { x: 24, y: 200, width: 572, height: 200 },
    properties: { pageSize: 20 },
  });

  const article = registry.createNode('visual.news.article-detail', {
    id: 'news-article',
    label: 'Article',
    layout: { x: 24, y: 416, width: 572, height: 180 },
  });

  return {
    id: options.id ?? crypto.randomUUID(),
    name: 'News finder',
    description: 'Language, region, and type filters with search and article detail.',
    templateId: NEWS_FINDER_TEMPLATE_ID,
    version: options.version ?? 1,
    nodes: [language, region, newsType, search, results, article],
    bindings: [
      {
        id: 'news-b1',
        sourceNodeId: 'news-results',
        sourcePortId: 'selected-row',
        targetNodeId: 'news-article',
        targetPortId: 'row',
      },
    ],
  };
}
