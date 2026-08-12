import type { IRComponent } from '@rosettadash/core';
import { WebComponentsExportError } from './types';
import {
  generateEquirectViewportStandalone,
  generateVideoSourceStandalone,
  generateWasmMediaEquirectStandalone,
} from './media-component-templates';
import { generateComponentCss } from './component-styles';
import { componentClassName, customElementTag, joinLines } from './utils';

const SUPPORTED_TYPES = new Set([
  'visual.input.text',
  'visual.input.select',
  'visual.input.date-range',
  'domain.time-preset',
  'visual.table',
  'visual.detail',
  'visual.skeleton',
  'visual.kpi',
  'visual.chart.line',
  'visual.chart.bar',
  'visual.chart.pie',
  'visual.display.3d-bar-chart',
  'visual.display.3d-scatter',
  'visual.display.3d-scene',
  'visual.display.3d-gltf-model',
  'visual.display.3d-geo-globe',
  'visual.svg.inline',
  'visual.svg.icon',
  'visual.media.video-source',
  'visual.media.equirect-viewport',
  'infra.wasm.asset',
  'visual.wasm.worker-host',
  'visual.wasm.module',
  'visual.wasm.media',
  'logic.timer',
  'visual.news.language-select',
  'visual.news.region-select',
  'visual.news.type-select',
  'visual.news.search-box',
  'visual.news.results-table',
  'visual.news.article-detail',
]);

export function generateComponentCssFile(component: IRComponent, exportName: string): string {
  return generateComponentCss(component, exportName);
}

export function generateLayoutCollapsibleFile(exportName: string): string {
  return generateCollapsible(exportName);
}

export function generateLayoutCollapsibleCss(exportName: string): string {
  return generateComponentCss(
    {
      id: exportName,
      type: 'layout.collapsible',
      label: 'Collapsible',
      category: 'layout',
      properties: {},
      inputs: [],
      outputs: [],
    },
    exportName,
  );
}

export function generateComponentFile(component: IRComponent, exportName: string): string {
  if (!SUPPORTED_TYPES.has(component.type)) {
    throw new WebComponentsExportError(
      `Unsupported Web Components export component type: ${component.type}`,
    );
  }

  switch (component.type) {
    case 'visual.input.text':
    case 'visual.news.search-box':
      return generateTextInput(exportName);
    case 'visual.input.select':
    case 'visual.news.language-select':
    case 'visual.news.region-select':
    case 'visual.news.type-select':
      return generateSelectInput(exportName);
    case 'visual.input.date-range':
      return generateDateRangeFilter(exportName);
    case 'domain.time-preset':
      return generateTimePreset(exportName);
    case 'visual.table':
    case 'visual.news.results-table':
      return generateDataTable(exportName);
    case 'visual.detail':
    case 'visual.news.article-detail':
      return generateDetailPanel(exportName);
    case 'visual.skeleton':
      return generateSkeleton(exportName);
    case 'visual.kpi':
      return generateKpiCard(exportName);
    case 'visual.chart.line':
      return generateLineChart(exportName);
    case 'visual.chart.bar':
      return generateBarChart(exportName);
    case 'visual.chart.pie':
      return generatePieChart(exportName);
    case 'visual.svg.inline':
      return generateSvgInline(exportName);
    case 'visual.svg.icon':
      return generateSvgIcon(exportName);
    case 'visual.media.video-source':
      return generateVideoSourceStandalone(exportName, customElementTag(exportName));
    case 'visual.media.equirect-viewport':
      return generateEquirectViewportStandalone(exportName, customElementTag(exportName));
    case 'infra.wasm.asset':
      return generateWasmAsset(exportName);
    case 'visual.wasm.worker-host':
      return generateWasmWorkerHost(exportName);
    case 'visual.wasm.module':
      return generateWasmModule(exportName);
    case 'visual.wasm.media':
      return component.properties?.['operation'] === 'equirect-extract'
        ? generateWasmMediaEquirectStandalone(exportName, customElementTag(exportName))
        : generateWasmMedia(exportName);
    case 'logic.timer':
      return generateTimer(exportName);
    default:
      return generatePlaceholder(exportName, component.label, component.type);
  }
}

function generateClassShell(
  exportName: string,
  bodyHtml: string,
  extraMembers = '',
  extraMethods = '',
): string {
  const tag = customElementTag(exportName);
  return joinLines([
    `import type { DateRange, Row } from '../types';`,
    `import { defineRosettaElement } from '../define-element';`,
    ``,
    ``,
    `export class ${exportName} extends HTMLElement {`,
    `  static readonly tagName = '${tag}';`,
    `  private renderRoot: ShadowRoot;`,
    ``,
    `  constructor() {`,
    `    super();`,
    `    this.renderRoot = this.attachShadow({ mode: 'open' });`,
    `  }`,
    ``,
    `  connectedCallback(): void {`,
    `    this.renderRoot.innerHTML = \`<link rel="stylesheet" href="./${exportName}.css" />${bodyHtml}\`;`,
    `    this.bindDom();`,
    `  }`,
    ``,
    `  setProperty(name: string, value: unknown): void {`,
    `    (this as Record<string, unknown>)[name] = value;`,
    `    this.render();`,
    `  }`,
    ``,
    `  protected bindDom(): void {}`,
    `  protected render(): void {}`,
    extraMembers,
    extraMethods,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineRosettaElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generateTextInput(exportName: string): string {
  return joinLines([
    `import type { Row } from '../types';`,
    `import { defineRosettaElement } from '../define-element';`,
    ``,
    ``,
    `export class ${exportName} extends HTMLElement {`,
    `  static readonly tagName = '${customElementTag(exportName)}';`,
    `  private input: HTMLInputElement | null = null;`,
    `  placeholder = '';`,
    `  required = false;`,
    `  value = '';`,
    ``,
    `  connectedCallback(): void {`,
    `    this.render();`,
    `  }`,
    ``,
    `  setProperty(name: string, value: unknown): void {`,
    `    (this as Record<string, unknown>)[name] = value;`,
    `    this.render();`,
    `  }`,
    ``,
    `  private render(): void {`,
    `    if (!this.shadowRoot) {`,
    `      this.attachShadow({ mode: 'open' });`,
    `    }`,
    `    this.shadowRoot!.innerHTML = \`<link rel="stylesheet" href="./${exportName}.css" /><label class="field"><input class="input" type="text" placeholder="\${this.placeholder}" ?required="\${this.required}" value="\${this.value}" /></label>\`;`,
    `    this.input = this.shadowRoot!.querySelector('input');`,
    `    this.input?.addEventListener('input', () => {`,
    `      this.value = this.input?.value ?? '';`,
    `      this.dispatchEvent(new CustomEvent('value-change', { detail: this.value, bubbles: true }));`,
    `    });`,
    `  }`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineRosettaElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generateSelectInput(exportName: string): string {
  return joinLines([
    `import type { Row } from '../types';`,
    `import { defineRosettaElement } from '../define-element';`,
    ``,
    ``,
    `export class ${exportName} extends HTMLElement {`,
    `  static readonly tagName = '${customElementTag(exportName)}';`,
    `  placeholder = 'Select…';`,
    `  options: Row[] = [];`,
    `  value = '';`,
    ``,
    `  connectedCallback(): void {`,
    `    this.render();`,
    `  }`,
    ``,
    `  setProperty(name: string, value: unknown): void {`,
    `    (this as Record<string, unknown>)[name] = value;`,
    `    this.render();`,
    `  }`,
    ``,
    `  private render(): void {`,
    `    if (!this.shadowRoot) {`,
    `      this.attachShadow({ mode: 'open' });`,
    `    }`,
    `    const optionMarkup = this.options`,
    `      .map((option, index) => {`,
    `        const value = String(option.id ?? option.label ?? index);`,
    `        const label = String(option.label ?? option.id ?? index);`,
    `        return \`<option value="\${value}">\${label}</option>\`;`,
    `      })`,
    `      .join('');`,
    `    this.shadowRoot!.innerHTML = \`<link rel="stylesheet" href="./${exportName}.css" /><label class="field"><select class="select"><option value="">\${this.placeholder}</option>\${optionMarkup}</select></label>\`;`,
    `    const select = this.shadowRoot!.querySelector('select');`,
    `    if (select) {`,
    `      select.value = this.value;`,
    `      select.addEventListener('change', () => {`,
    `        this.value = select.value;`,
    `        this.dispatchEvent(new CustomEvent('value-change', { detail: this.value, bubbles: true }));`,
    `      });`,
    `    }`,
    `  }`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineRosettaElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generateDateRangeFilter(exportName: string): string {
  return joinLines([
    `import type { DateRange } from '../types';`,
    `import { defineRosettaElement } from '../define-element';`,
    ``,
    ``,
    `export class ${exportName} extends HTMLElement {`,
    `  static readonly tagName = '${customElementTag(exportName)}';`,
    `  range: DateRange | undefined;`,
    ``,
    `  connectedCallback(): void {`,
    `    this.render();`,
    `  }`,
    ``,
    `  setProperty(name: string, value: unknown): void {`,
    `    (this as Record<string, unknown>)[name] = value;`,
    `  }`,
    ``,
    `  private emitRange(start: string, end: string): void {`,
    `    this.range = { start, end };`,
    `    this.dispatchEvent(new CustomEvent('range-change', { detail: this.range, bubbles: true }));`,
    `  }`,
    ``,
    `  private render(): void {`,
    `    if (!this.shadowRoot) {`,
    `      this.attachShadow({ mode: 'open' });`,
    `    }`,
    `    const start = this.range?.start ?? '';`,
    `    const end = this.range?.end ?? '';`,
    `    this.shadowRoot!.innerHTML = \`<link rel="stylesheet" href="./${exportName}.css" /><div class="date-range"><label>Start<input class="input" type="date" value="\${start}" /></label><label>End<input class="input" type="date" value="\${end}" /></label></div>\`;`,
    `    const inputs = this.shadowRoot!.querySelectorAll('input');`,
    `    inputs.forEach((input) => {`,
    `      input.addEventListener('change', () => {`,
    `        const values = [...this.shadowRoot!.querySelectorAll('input')].map((el) => (el as HTMLInputElement).value);`,
    `        this.emitRange(values[0] ?? '', values[1] ?? '');`,
    `      });`,
    `    });`,
    `  }`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineRosettaElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generateTimePreset(exportName: string): string {
  return generatePlaceholder(exportName, 'Time preset', 'domain.time-preset');
}

function generateDataTable(exportName: string): string {
  return joinLines([
    `import type { Row } from '../types';`,
    `import { defineRosettaElement } from '../define-element';`,
    `import { isNumericFieldKey, TABLE_NUMERIC_CELL_CLASS } from '../presentation/numeric-fields.js';`,
    ``,
    ``,
    `export class ${exportName} extends HTMLElement {`,
    `  static readonly tagName = '${customElementTag(exportName)}';`,
    `  data: Row[] = [];`,
    `  selectedRow: Row | undefined;`,
    ``,
    `  connectedCallback(): void {`,
    `    this.render();`,
    `  }`,
    ``,
    `  setProperty(name: string, value: unknown): void {`,
    `    (this as Record<string, unknown>)[name] = value;`,
    `    this.render();`,
    `  }`,
    ``,
    `  private render(): void {`,
    `    if (!this.shadowRoot) {`,
    `      this.attachShadow({ mode: 'open' });`,
    `    }`,
    `    const columns = this.data.length > 0 ? Object.keys(this.data[0]) : ['label', 'value'];`,
    `    const head = columns`,
    `      .map((column) => {`,
    `        const numericClass = isNumericFieldKey(column) ? \` class="\${TABLE_NUMERIC_CELL_CLASS}"\` : '';`,
    `        return \`<th\${numericClass}>\${column}</th>\`;`,
    `      })`,
    `      .join('');`,
    `    const rows = this.data`,
    `      .map((row, index) => {`,
    `        const cells = columns`,
    `          .map((column) => {`,
    `            const numericClass = isNumericFieldKey(column) ? \` class="\${TABLE_NUMERIC_CELL_CLASS}"\` : '';`,
    `            return \`<td\${numericClass}>\${String(row[column] ?? '')}</td>\`;`,
    `          })`,
    `          .join('');`,
    `        const selected = this.selectedRow === row ? ' table-row--selected' : '';`,
    `        return \`<tr class="table-row\${selected}" data-index="\${index}">\${cells}</tr>\`;`,
    `      })`,
    `      .join('');`,
    `    this.shadowRoot!.innerHTML = \`<link rel="stylesheet" href="./${exportName}.css" /><table class="table"><thead><tr>\${head}</tr></thead><tbody>\${rows}</tbody></table>\`;`,
    `    this.shadowRoot!.querySelectorAll('.table-row').forEach((rowEl) => {`,
    `      rowEl.addEventListener('click', () => {`,
    `        const index = Number((rowEl as HTMLElement).dataset.index ?? '-1');`,
    `        const next = this.data[index];`,
    `        this.selectedRow = next;`,
    `        this.dispatchEvent(new CustomEvent('row-select', { detail: next, bubbles: true }));`,
    `        this.render();`,
    `      });`,
    `    });`,
    `  }`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineRosettaElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generateDetailPanel(exportName: string): string {
  return joinLines([
    `import type { Row } from '../types';`,
    `import { defineRosettaElement } from '../define-element';`,
    `import { DETAIL_NUMERIC_VALUE_CLASS, isNumericFieldKey } from '../presentation/numeric-fields.js';`,
    ``,
    ``,
    `export class ${exportName} extends HTMLElement {`,
    `  static readonly tagName = '${customElementTag(exportName)}';`,
    `  selectedRow: Row | undefined;`,
    ``,
    `  connectedCallback(): void {`,
    `    this.render();`,
    `  }`,
    ``,
    `  setProperty(name: string, value: unknown): void {`,
    `    (this as Record<string, unknown>)[name] = value;`,
    `    this.render();`,
    `  }`,
    ``,
    `  private render(): void {`,
    `    if (!this.shadowRoot) {`,
    `      this.attachShadow({ mode: 'open' });`,
    `    }`,
    `    if (!this.selectedRow) {`,
    `      this.shadowRoot!.innerHTML = \`<link rel="stylesheet" href="./${exportName}.css" /><section class="detail-panel"><p class="detail-panel__empty">Select a row to view details.</p></section>\`;`,
    `      return;`,
    `    }`,
    `    const fields = Object.entries(this.selectedRow)`,
    `      .map(([key, value]) => {`,
    `        const numericClass = isNumericFieldKey(key) ? \` class="\${DETAIL_NUMERIC_VALUE_CLASS}"\` : '';`,
    `        return \`<div class="detail-panel__field"><dt>\${key}</dt><dd\${numericClass}>\${String(value ?? '')}</dd></div>\`;`,
    `      })`,
    `      .join('');`,
    `    this.shadowRoot!.innerHTML = \`<link rel="stylesheet" href="./${exportName}.css" /><section class="detail-panel"><dl class="detail-panel__fields">\${fields}</dl></section>\`;`,
    `  }`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineRosettaElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generateSkeleton(exportName: string): string {
  return generatePlaceholder(exportName, 'Loading skeleton', 'visual.skeleton');
}

function generateKpiCard(exportName: string): string {
  return joinLines([
    `import type { Row } from '../types';`,
    `import { defineRosettaElement } from '../define-element';`,
    ``,
    ``,
    `export class ${exportName} extends HTMLElement {`,
    `  static readonly tagName = '${customElementTag(exportName)}';`,
    `  title = 'KPI';`,
    `  data: Row[] = [];`,
    ``,
    `  connectedCallback(): void {`,
    `    this.render();`,
    `  }`,
    ``,
    `  setProperty(name: string, value: unknown): void {`,
    `    (this as Record<string, unknown>)[name] = value;`,
    `    this.render();`,
    `  }`,
    ``,
    `  private render(): void {`,
    `    if (!this.shadowRoot) {`,
    `      this.attachShadow({ mode: 'open' });`,
    `    }`,
    `    const value = this.data.length > 0 ? String(Object.values(this.data[0])[0] ?? '—') : '—';`,
    `    this.shadowRoot!.innerHTML = \`<link rel="stylesheet" href="./${exportName}.css" /><section class="kpi-card"><h3>\${this.title}</h3><p class="kpi-card__value">\${value}</p></section>\`;`,
    `  }`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineRosettaElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generateLineChart(exportName: string): string {
  return joinLines([
    `import type { Row } from '../types';`,
    `import { defineRosettaElement } from '../define-element';`,
    ``,
    ``,
    `export class ${exportName} extends HTMLElement {`,
    `  static readonly tagName = '${customElementTag(exportName)}';`,
    `  title = 'Line chart';`,
    `  data: Row[] = [];`,
    ``,
    `  connectedCallback(): void {`,
    `    this.render();`,
    `  }`,
    ``,
    `  setProperty(name: string, value: unknown): void {`,
    `    (this as Record<string, unknown>)[name] = value;`,
    `    this.render();`,
    `  }`,
    ``,
    `  private render(): void {`,
    `    if (!this.shadowRoot) {`,
    `      this.attachShadow({ mode: 'open' });`,
    `    }`,
    `    const values = this.data.map((row, index) => Number(row.value ?? index + 1));`,
    `    const points = values.length`,
    `      ? values.map((value, index) => \`\${(index / Math.max(values.length - 1, 1)) * 100},\${100 - value}\`).join(' ')`,
    `      : '0,100 100,0';`,
    `    this.shadowRoot!.innerHTML = \`<link rel="stylesheet" href="./${exportName}.css" /><section class="chart-card"><h3>\${this.title}</h3><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline fill="none" stroke="var(--db-accent, #2563eb)" stroke-width="2" points="\${points}" /></svg></section>\`;`,
    `  }`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineRosettaElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generateBarChart(exportName: string): string {
  return generateLineChart(exportName);
}

function generatePieChart(exportName: string): string {
  return joinLines([
    `import type { Row } from '../types';`,
    `import { defineRosettaElement } from '../define-element';`,
    ``,
    ``,
    `export class ${exportName} extends HTMLElement {`,
    `  static readonly tagName = '${customElementTag(exportName)}';`,
    `  title = 'Pie chart';`,
    `  donut = false;`,
    `  data: Row[] = [];`,
    ``,
    `  connectedCallback(): void {`,
    `    this.render();`,
    `  }`,
    ``,
    `  setProperty(name: string, value: unknown): void {`,
    `    (this as Record<string, unknown>)[name] = value;`,
    `    this.render();`,
    `  }`,
    ``,
    `  private render(): void {`,
    `    if (!this.shadowRoot) {`,
    `      this.attachShadow({ mode: 'open' });`,
    `    }`,
    `    const donutClass = this.donut ? ' pie-chart--donut' : '';`,
    `    this.shadowRoot!.innerHTML = \`<link rel="stylesheet" href="./${exportName}.css" /><section class="chart-card"><h3>\${this.title}</h3><div class="pie-chart\${donutClass}"></div></section>\`;`,
    `  }`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineRosettaElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generateTimer(exportName: string): string {
  return generatePlaceholder(exportName, 'Timer', 'logic.timer');
}

function generateSvgInline(exportName: string): string {
  return joinLines([
    `import type { Row } from '../types';`,
    `import { defineRosettaElement } from '../define-element';`,
    ``,
    ``,
    `export class ${exportName} extends HTMLElement {`,
    `  static readonly tagName = '${customElementTag(exportName)}';`,
    `  sourceMode: 'inline' | 'url' | 'path' = 'inline';`,
    `  markup = '';`,
    `  url = '';`,
    `  assetPath = '';`,
    `  width = 120;`,
    `  height = 120;`,
    `  ariaLabel = 'SVG graphic';`,
    `  fillField = '';`,
    `  row: Row | undefined;`,
    ``,
    `  connectedCallback(): void {`,
    `    this.render();`,
    `  }`,
    ``,
    `  setProperty(name: string, value: unknown): void {`,
    `    (this as Record<string, unknown>)[name] = value;`,
    `    this.render();`,
    `  }`,
    ``,
    `  private render(): void {`,
    `    if (!this.shadowRoot) {`,
    `      this.attachShadow({ mode: 'open' });`,
    `    }`,
    `    const fillColor =`,
    `      this.fillField && this.row && this.row[this.fillField] !== undefined`,
    `        ? String(this.row[this.fillField])`,
    `        : '';`,
    `    const style = \`width:\${this.width}px;height:\${this.height}px;\${fillColor ? \`color:\${fillColor};\` : ''}\`;`,
    `    let body = \`<p class="svg-inline__placeholder">Add SVG markup</p>\`;`,
    `    if (this.sourceMode === 'url' && this.url) {`,
    `      body = \`<img src="\${this.url}" alt="\${this.ariaLabel}" />\`;`,
    `    } else if (this.sourceMode === 'path' && this.assetPath) {`,
    `      body = \`<p class="svg-inline__placeholder">Asset: \${this.assetPath}</p>\`;`,
    `    } else if (this.markup) {`,
    `      body = this.markup;`,
    `    }`,
    `    this.shadowRoot!.innerHTML = \`<link rel="stylesheet" href="./${exportName}.css" /><figure class="svg-inline" style="\${style}" aria-label="\${this.ariaLabel}">\${body}</figure>\`;`,
    `  }`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineRosettaElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generateSvgIcon(exportName: string): string {
  return joinLines([
    `import type { Row } from '../types';`,
    `import { defineRosettaElement } from '../define-element';`,
    ``,
    ``,
    `export class ${exportName} extends HTMLElement {`,
    `  static readonly tagName = '${customElementTag(exportName)}';`,
    `  markup = '';`,
    `  size = 24;`,
    `  color = 'currentColor';`,
    `  title = 'Icon';`,
    `  ariaLabel = '';`,
    `  colorField = '';`,
    `  row: Row | undefined;`,
    ``,
    `  connectedCallback(): void {`,
    `    this.render();`,
    `  }`,
    ``,
    `  setProperty(name: string, value: unknown): void {`,
    `    (this as Record<string, unknown>)[name] = value;`,
    `    this.render();`,
    `  }`,
    ``,
    `  private render(): void {`,
    `    if (!this.shadowRoot) {`,
    `      this.attachShadow({ mode: 'open' });`,
    `    }`,
    `    const resolvedColor =`,
    `      this.colorField && this.row && this.row[this.colorField] !== undefined`,
    `        ? String(this.row[this.colorField])`,
    `        : this.color;`,
    `    const label = this.ariaLabel || this.title;`,
    `    this.shadowRoot!.innerHTML = \`<link rel="stylesheet" href="./${exportName}.css" /><span class="svg-icon" title="\${this.title}" aria-label="\${label}" style="width:\${this.size}px;height:\${this.size}px;color:\${resolvedColor}">\${this.markup}</span>\`;`,
    `  }`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineRosettaElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generateWasmAsset(exportName: string): string {
  return joinLines([
    `import { defineRosettaElement } from '../define-element';`,
    ``,
    ``,
    `export class ${exportName} extends HTMLElement {`,
    `  static readonly tagName = '${customElementTag(exportName)}';`,
    `  modulePath = 'wasm/modules/example.wasm';`,
    `  gluePath = 'wasm/glue/example.js';`,
    ``,
    `  connectedCallback(): void { this.render(); }`,
    `  setProperty(name: string, value: unknown): void {`,
    `    (this as Record<string, unknown>)[name] = value;`,
    `    this.render();`,
    `  }`,
    `  private render(): void {`,
    `    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });`,
    `    this.shadowRoot!.innerHTML = \`<link rel="stylesheet" href="./${exportName}.css" /><section class="wasm-asset"><span class="wasm-asset__badge">WASM</span><code>\${this.modulePath}</code>\${this.gluePath ? \`<span> + \${this.gluePath}</span>\` : ''}</section>\`;`,
    `  }`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineRosettaElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generateWasmWorkerHost(exportName: string): string {
  return generatePlaceholder(exportName, 'WASM Worker Host', 'visual.wasm.worker-host');
}

function generateWasmModule(exportName: string): string {
  return generatePlaceholder(exportName, 'WASM Module', 'visual.wasm.module');
}

function generateWasmMedia(exportName: string): string {
  return joinLines([
    `import { defineRosettaElement } from '../define-element';`,
    ``,
    ``,
    `export class ${exportName} extends HTMLElement {`,
    `  static readonly tagName = '${customElementTag(exportName)}';`,
    `  label = 'Media transcode';`,
    `  operation = 'transcode';`,
    `  outputFormat = 'mp4';`,
    `  showProgress = true;`,
    `  progress = 0;`,
    ``,
    `  connectedCallback(): void { this.render(); }`,
    `  setProperty(name: string, value: unknown): void {`,
    `    (this as Record<string, unknown>)[name] = value;`,
    `    this.render();`,
    `  }`,
    `  private render(): void {`,
    `    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });`,
    `    const progressMarkup = this.showProgress`,
    `      ? \`<div class="wasm-media__progress" role="progressbar" aria-valuenow="\${this.progress}"><span style="width:\${this.progress}%"></span></div>\``,
    `      : '';`,
    `    this.shadowRoot!.innerHTML = \`<link rel="stylesheet" href="./${exportName}.css" /><section class="wasm-media"><header><h3>\${this.label}</h3><span>\${this.operation} → \${this.outputFormat}</span></header>\${progressMarkup}</section>\`;`,
    `  }`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineRosettaElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generateCollapsible(exportName: string): string {
  const tag = customElementTag(exportName);
  const rootClass = componentClassName(exportName);
  return joinLines([
    `import { defineRosettaElement } from '../define-element';`,
    ``,
    `export class ${exportName} extends HTMLElement {`,
    `  static readonly tagName = '${tag}';`,
    `  title = 'Section';`,
    `  summary = '';`,
    `  expanded = false;`,
    `  private toggle: HTMLButtonElement | null = null;`,
    `  private panel: HTMLElement | null = null;`,
    ``,
    `  connectedCallback(): void {`,
    `    this.render();`,
    `  }`,
    ``,
    `  setProperty(name: string, value: unknown): void {`,
    `    (this as Record<string, unknown>)[name] = value;`,
    `    this.render();`,
    `  }`,
    ``,
    `  private render(): void {`,
    `    if (!this.shadowRoot) {`,
    `      this.attachShadow({ mode: 'open' });`,
    `    }`,
    `    const openClass = this.expanded ? ' ${rootClass}--open' : '';`,
    `    const panelMarkup = this.expanded`,
    `      ? \`<div class="${rootClass}__panel"><div class="${rootClass}__slot"><slot></slot></div></div>\``,
    `      : '';`,
    `    this.shadowRoot!.innerHTML = \`<link rel="stylesheet" href="./${exportName}.css" /><section class="${rootClass}\${openClass}"><button type="button" class="${rootClass}__toggle" aria-expanded="\${this.expanded}"><span class="${rootClass}__heading"><span class="${rootClass}__title">\${this.title}</span><span class="${rootClass}__summary">\${this.summary}</span></span><span class="${rootClass}__chevron" aria-hidden="true"></span></button>\${panelMarkup}</section>\`;`,
    `    this.toggle = this.shadowRoot!.querySelector('button');`,
    `    this.panel = this.shadowRoot!.querySelector('.${rootClass}__panel');`,
    `    this.toggle?.addEventListener('click', () => {`,
    `      this.expanded = !this.expanded;`,
    `      this.dispatchEvent(new CustomEvent('toggle', { detail: this.expanded, bubbles: true }));`,
    `      this.render();`,
    `    });`,
    `  }`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineRosettaElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generatePlaceholder(exportName: string, label: string, type: string): string {
  return joinLines([
    `import { defineRosettaElement } from '../define-element';`,
    ``,
    ``,
    `export class ${exportName} extends HTMLElement {`,
    `  static readonly tagName = '${customElementTag(exportName)}';`,
    ``,
    `  connectedCallback(): void {`,
    `    if (!this.shadowRoot) {`,
    `      this.attachShadow({ mode: 'open' });`,
    `    }`,
    `    this.shadowRoot!.innerHTML = \`<link rel="stylesheet" href="./${exportName}.css" /><p>${label} <code>${type}</code></p>\`;`,
    `  }`,
    ``,
    `  setProperty(_name: string, _value: unknown): void {}`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineRosettaElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

export function generateDefineElementHelper(): string {
  return joinLines([
    `export function defineRosettaElement(`,
    `  tagName: string,`,
    `  ctor: CustomElementConstructor,`,
    `): void {`,
    `  if (!customElements.get(tagName)) {`,
    `    customElements.define(tagName, ctor);`,
    `  }`,
    `}`,
    ``,
  ]);
}

export function generateRegisterAllFile(componentNames: string[]): string {
  return joinLines([
    ...componentNames.map((name) => `import { register${name} } from './components/${name}';`),
    `import { registerRdDashboard } from './dashboard';`,
    ``,
    `export function registerRosettaDashElements(): void {`,
    ...componentNames.map((name) => `  register${name}();`),
    `  registerRdDashboard();`,
    `}`,
    ``,
  ]);
}
