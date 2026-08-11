import type { IRComponent } from '@dashbuilder/core';
import { WebComponentsExportError } from './types';
import { customElementTag, joinLines } from './utils';

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
  'logic.timer',
  'visual.news.language-select',
  'visual.news.region-select',
  'visual.news.type-select',
  'visual.news.search-box',
  'visual.news.results-table',
  'visual.news.article-detail',
]);

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
    case 'logic.timer':
      return generateTimer(exportName);
    default:
      return generatePlaceholder(exportName, component.label, component.type);
  }
}

function shellStyles(): string {
  return [
    `:host { display: block; font-family: system-ui, sans-serif; color: var(--db-text, #1f2937); }`,
    `.field, .input, .select, .table, .kpi-card, .chart-card, .detail-panel, .timer, .skeleton {`,
    `  border: 1px solid var(--db-border, #d9dee7); border-radius: 0.5rem; }`,
    `.input, .select { width: 100%; padding: 0.5rem 0.75rem; box-sizing: border-box; }`,
    `.table { width: 100%; border-collapse: collapse; }`,
    `.table th, .table td { padding: 0.5rem 0.75rem; text-align: left; }`,
    `.kpi-card, .chart-card, .detail-panel, .timer, .skeleton { padding: 1rem; }`,
    `.table-row { cursor: pointer; }`,
    `.table-row--selected { background: color-mix(in srgb, var(--db-accent, #2563eb) 12%, transparent); }`,
  ].join('\n');
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
    `import { defineDashElement } from '../define-element';`,
    ``,
    `const STYLES = \`${shellStyles()}\`;`,
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
    `    this.renderRoot.innerHTML = \`<style>\${STYLES}</style>${bodyHtml}\`;`,
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
    `  defineDashElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generateTextInput(exportName: string): string {
  return joinLines([
    `import type { Row } from '../types';`,
    `import { defineDashElement } from '../define-element';`,
    ``,
    `const STYLES = \`${shellStyles()}\`;`,
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
    `    this.shadowRoot!.innerHTML = \`<style>\${STYLES}</style><label class="field"><input class="input" type="text" placeholder="\${this.placeholder}" ?required="\${this.required}" value="\${this.value}" /></label>\`;`,
    `    this.input = this.shadowRoot!.querySelector('input');`,
    `    this.input?.addEventListener('input', () => {`,
    `      this.value = this.input?.value ?? '';`,
    `      this.dispatchEvent(new CustomEvent('value-change', { detail: this.value, bubbles: true }));`,
    `    });`,
    `  }`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineDashElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generateSelectInput(exportName: string): string {
  return joinLines([
    `import type { Row } from '../types';`,
    `import { defineDashElement } from '../define-element';`,
    ``,
    `const STYLES = \`${shellStyles()}\`;`,
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
    `    this.shadowRoot!.innerHTML = \`<style>\${STYLES}</style><label class="field"><select class="select"><option value="">\${this.placeholder}</option>\${optionMarkup}</select></label>\`;`,
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
    `  defineDashElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generateDateRangeFilter(exportName: string): string {
  return joinLines([
    `import type { DateRange } from '../types';`,
    `import { defineDashElement } from '../define-element';`,
    ``,
    `const STYLES = \`${shellStyles()} .date-range { display: grid; gap: 0.5rem; padding: 0.75rem; }\`;`,
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
    `    this.shadowRoot!.innerHTML = \`<style>\${STYLES}</style><div class="date-range"><label>Start<input class="input" type="date" value="\${start}" /></label><label>End<input class="input" type="date" value="\${end}" /></label></div>\`;`,
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
    `  defineDashElement(${exportName}.tagName, ${exportName});`,
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
    `import { defineDashElement } from '../define-element';`,
    ``,
    `const STYLES = \`${shellStyles()}\`;`,
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
    `    const head = columns.map((column) => \`<th>\${column}</th>\`).join('');`,
    `    const rows = this.data`,
    `      .map((row, index) => {`,
    `        const cells = columns.map((column) => \`<td>\${String(row[column] ?? '')}</td>\`).join('');`,
    `        const selected = this.selectedRow === row ? ' table-row--selected' : '';`,
    `        return \`<tr class="table-row\${selected}" data-index="\${index}">\${cells}</tr>\`;`,
    `      })`,
    `      .join('');`,
    `    this.shadowRoot!.innerHTML = \`<style>\${STYLES}</style><table class="table"><thead><tr>\${head}</tr></thead><tbody>\${rows}</tbody></table>\`;`,
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
    `  defineDashElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generateDetailPanel(exportName: string): string {
  return joinLines([
    `import type { Row } from '../types';`,
    `import { defineDashElement } from '../define-element';`,
    ``,
    `const STYLES = \`${shellStyles()} .detail-panel__empty { color: var(--db-muted, #6b7280); }\`;`,
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
    `      this.shadowRoot!.innerHTML = \`<style>\${STYLES}</style><section class="detail-panel"><p class="detail-panel__empty">Select a row to view details.</p></section>\`;`,
    `      return;`,
    `    }`,
    `    const fields = Object.entries(this.selectedRow)`,
    `      .map(([key, value]) => \`<div><dt>\${key}</dt><dd>\${String(value ?? '')}</dd></div>\`)`,
    `      .join('');`,
    `    this.shadowRoot!.innerHTML = \`<style>\${STYLES}</style><section class="detail-panel"><dl>\${fields}</dl></section>\`;`,
    `  }`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineDashElement(${exportName}.tagName, ${exportName});`,
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
    `import { defineDashElement } from '../define-element';`,
    ``,
    `const STYLES = \`${shellStyles()} .kpi-card__value { font-size: 1.5rem; font-weight: 700; margin: 0.25rem 0 0; }\`;`,
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
    `    this.shadowRoot!.innerHTML = \`<style>\${STYLES}</style><section class="kpi-card"><h3>\${this.title}</h3><p class="kpi-card__value">\${value}</p></section>\`;`,
    `  }`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineDashElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generateLineChart(exportName: string): string {
  return joinLines([
    `import type { Row } from '../types';`,
    `import { defineDashElement } from '../define-element';`,
    ``,
    `const STYLES = \`${shellStyles()} .chart-card svg { width: 100%; height: 8rem; }\`;`,
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
    `    this.shadowRoot!.innerHTML = \`<style>\${STYLES}</style><section class="chart-card"><h3>\${this.title}</h3><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline fill="none" stroke="var(--db-accent, #2563eb)" stroke-width="2" points="\${points}" /></svg></section>\`;`,
    `  }`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineDashElement(${exportName}.tagName, ${exportName});`,
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
    `import { defineDashElement } from '../define-element';`,
    ``,
    `const STYLES = \`${shellStyles()} .pie-chart { width: 8rem; height: 8rem; border-radius: 999px; border: 1px solid var(--db-border, #d9dee7); margin: 0 auto; }\`;`,
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
    `    this.shadowRoot!.innerHTML = \`<style>\${STYLES}</style><section class="chart-card"><h3>\${this.title}</h3><div class="pie-chart\${donutClass}"></div></section>\`;`,
    `  }`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineDashElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

function generateTimer(exportName: string): string {
  return generatePlaceholder(exportName, 'Timer', 'logic.timer');
}

function generatePlaceholder(exportName: string, label: string, type: string): string {
  return joinLines([
    `import { defineDashElement } from '../define-element';`,
    ``,
    `const STYLES = \`:host { display: block; padding: 1rem; border: 1px dashed var(--db-border, #d9dee7); border-radius: 0.5rem; color: var(--db-muted, #6b7280); font: 0.875rem system-ui, sans-serif; }\`;`,
    ``,
    `export class ${exportName} extends HTMLElement {`,
    `  static readonly tagName = '${customElementTag(exportName)}';`,
    ``,
    `  connectedCallback(): void {`,
    `    if (!this.shadowRoot) {`,
    `      this.attachShadow({ mode: 'open' });`,
    `    }`,
    `    this.shadowRoot!.innerHTML = \`<style>\${STYLES}</style><p>${label} <code>${type}</code></p>\`;`,
    `  }`,
    ``,
    `  setProperty(_name: string, _value: unknown): void {}`,
    `}`,
    ``,
    `export function register${exportName}(): void {`,
    `  defineDashElement(${exportName}.tagName, ${exportName});`,
    `}`,
    ``,
  ]);
}

export function generateDefineElementHelper(): string {
  return joinLines([
    `export function defineDashElement(`,
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
    `import { registerDbDashboard } from './dashboard';`,
    ``,
    `export function registerDashBuilderElements(): void {`,
    ...componentNames.map((name) => `  register${name}();`),
    `  registerDbDashboard();`,
    `}`,
    ``,
  ]);
}
