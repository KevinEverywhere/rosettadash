import type { IRComponent } from '@rosettadash/core';
import { numericPresentationCssLines } from '@rosettadash/core';
import { componentClassName, customElementTag } from './utils';

export function shellStyles(rootClass: string): string {
  return [
    `:host { display: block; font-family: system-ui, sans-serif; color: var(--db-text, #1f2937); }`,
    `.${rootClass} .field, .${rootClass} .input, .${rootClass} .select, .${rootClass} .table,`,
    `.${rootClass} .chart-card, .${rootClass} .detail-panel, .${rootClass} .timer, .${rootClass} .skeleton {`,
    `  border: 1px solid var(--db-border, #d9dee7); border-radius: 0.5rem; }`,
    `.${rootClass} .input, .${rootClass} .select { width: 100%; padding: 0.5rem 0.75rem; box-sizing: border-box; }`,
    `.${rootClass} .table { width: 100%; border-collapse: collapse; }`,
    `.${rootClass} .table th, .${rootClass} .table td { padding: 0.5rem 0.75rem; text-align: left; }`,
    ...numericPresentationCssLines(`.${rootClass}`),
    `.${rootClass} .chart-card, .${rootClass} .detail-panel, .${rootClass} .timer, .${rootClass} .skeleton { padding: 1rem; }`,
    `.${rootClass} .table-row { cursor: pointer; }`,
    `.${rootClass} .table-row--selected { background: color-mix(in srgb, var(--db-accent, #2563eb) 12%, transparent); }`,
  ].join('\n');
}

export function componentStyleLink(exportName: string): string {
  return `<link rel="stylesheet" href="./${exportName}.css" />`;
}

export function generateComponentCss(component: IRComponent, exportName: string): string {
  const rootClass = componentClassName(exportName);
  const base = shellStyles(rootClass);

  switch (component.type) {
    case 'visual.input.date-range':
      return `${base}\n.${rootClass} .date-range { display: grid; gap: 0.5rem; padding: 0.75rem; }`;
    case 'visual.detail':
    case 'visual.news.article-detail':
      return `${base}\n.${rootClass} .detail-panel__empty { color: var(--db-muted, #6b7280); }`;
    case 'visual.kpi':
      return `${base}\n.${rootClass} .kpi-card__value { font-size: 1.5rem; font-weight: 700; margin: 0.25rem 0 0; text-align: right; font-variant-numeric: tabular-nums; }`;
    case 'visual.chart.line':
    case 'visual.chart.bar':
      return `${base}\n.${rootClass} .chart-card svg { width: 100%; height: 8rem; }`;
    case 'visual.chart.pie':
      return `${base}\n.${rootClass} .pie-chart { width: 8rem; height: 8rem; border-radius: 999px; border: 1px solid var(--db-border, #d9dee7); margin: 0 auto; }`;
    case 'visual.svg.inline':
      return `${base}\n.${rootClass} .svg-inline { display: inline-flex; align-items: center; justify-content: center; }\n.${rootClass} .svg-inline :is(svg, img) { width: 100%; height: 100%; }\n.${rootClass} .svg-inline__placeholder { margin: 0; font-size: 0.75rem; color: var(--db-muted, #6b7280); }`;
    case 'visual.svg.icon':
      return `${base}\n.${rootClass} .svg-icon { display: inline-flex; align-items: center; justify-content: center; }\n.${rootClass} .svg-icon :is(svg) { width: 100%; height: 100%; }`;
    case 'infra.wasm.asset':
      return `${base}\n.${rootClass} .wasm-asset__badge { display: inline-block; margin-right: 0.5rem; padding: 0.125rem 0.5rem; border-radius: 999px; background: rgb(99 102 241 / 15%); color: #4338ca; font-size: 0.6875rem; font-weight: 700; }`;
    case 'visual.wasm.media':
      return `${base}\n.${rootClass} .wasm-media__progress { height: 0.375rem; border-radius: 999px; background: rgb(148 163 184 / 25%); overflow: hidden; }\n.${rootClass} .wasm-media__progress span { display: block; height: 100%; background: #6366f1; }`;
    case 'layout.collapsible':
      return generateCollapsibleCss(rootClass);
    default:
      if (component.type.startsWith('visual.') || component.type.startsWith('domain.')) {
        return base;
      }
      return `:host { display: block; padding: 1rem; border: 1px dashed var(--db-border, #d9dee7); border-radius: 0.5rem; color: var(--db-muted, #6b7280); font: 0.875rem system-ui, sans-serif; }`;
  }
}

function generateCollapsibleCss(rootClass: string): string {
  return [
    `:host { display: block; font-family: system-ui, sans-serif; color: var(--db-text, #1f2937); }`,
    `.${rootClass} { border: 1px solid var(--db-border, #d9dee7); border-radius: 0.5rem; overflow: hidden; }`,
    `.${rootClass}__toggle { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.75rem 1rem; border: 0; background: var(--db-surface, #fff); cursor: pointer; text-align: left; font: inherit; }`,
    `.${rootClass}__heading { display: flex; flex-direction: column; gap: 0.125rem; min-width: 0; }`,
    `.${rootClass}__title { font-size: 0.875rem; font-weight: 700; }`,
    `.${rootClass}__summary { font-size: 0.75rem; color: var(--db-muted, #6b7280); }`,
    `.${rootClass}__chevron { width: 0.5rem; height: 0.5rem; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(45deg); transition: transform 0.15s ease; flex-shrink: 0; }`,
    `.${rootClass}--open .${rootClass}__chevron { transform: rotate(-135deg); }`,
    `.${rootClass}__panel { padding: 0 1rem 1rem; border-top: 1px solid var(--db-border, #d9dee7); }`,
    `.${rootClass}__slot { min-height: 2rem; padding: 0.75rem; border: 1px dashed var(--db-border, #d9dee7); border-radius: 0.375rem; color: var(--db-muted, #6b7280); font-size: 0.8125rem; }`,
  ].join('\n');
}

export function generateLayoutCollapsibleCss(exportName: string): string {
  return generateCollapsibleCss(componentClassName(exportName));
}

export function layoutCollapsibleTag(exportName: string): string {
  return customElementTag(exportName);
}
