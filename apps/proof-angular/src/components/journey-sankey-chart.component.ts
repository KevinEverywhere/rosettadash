import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface SankeyNode {
  id: string;
  label: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

interface LayoutNode extends SankeyNode {
  column: number;
  y: number;
  height: number;
}

const WIDTH = 640;
const HEIGHT = 280;
const PADDING = 16;
const NODE_WIDTH = 12;

function buildLayout(nodes: SankeyNode[], links: SankeyLink[]): { layoutNodes: LayoutNode[]; paths: string[] } {
  const columns = new Map<string, number>();
  const incoming = new Set(links.map((link) => link.target));
  const roots = nodes.filter((node) => !incoming.has(node.id));
  const queue = roots.length ? roots.map((node) => node.id) : [nodes[0]?.id].filter(Boolean) as string[];

  for (const id of queue) {
    columns.set(id, 0);
  }

  let guard = 0;
  while (guard < nodes.length * 2) {
    guard += 1;
    let progressed = false;
    for (const link of links) {
      const sourceCol = columns.get(link.source);
      if (sourceCol === undefined) {
        continue;
      }
      const nextCol = sourceCol + 1;
      const existing = columns.get(link.target);
      if (existing === undefined || nextCol > existing) {
        columns.set(link.target, nextCol);
        progressed = true;
      }
    }
    if (!progressed) {
      break;
    }
  }

  for (const node of nodes) {
    if (!columns.has(node.id)) {
      columns.set(node.id, 0);
    }
  }

  const maxColumn = Math.max(...columns.values(), 0);
  const byColumn = new Map<number, SankeyNode[]>();
  for (const node of nodes) {
    const column = columns.get(node.id) ?? 0;
    const list = byColumn.get(column) ?? [];
    list.push(node);
    byColumn.set(column, list);
  }

  const outTotals = new Map<string, number>();
  const inTotals = new Map<string, number>();
  for (const link of links) {
    outTotals.set(link.source, (outTotals.get(link.source) ?? 0) + link.value);
    inTotals.set(link.target, (inTotals.get(link.target) ?? 0) + link.value);
  }

  const layoutNodes: LayoutNode[] = [];
  for (const [, columnNodes] of byColumn.entries()) {
    const totalValue = columnNodes.reduce(
      (sum, node) => sum + Math.max(outTotals.get(node.id) ?? 0, inTotals.get(node.id) ?? 0, 1),
      0,
    );
    let yCursor = PADDING;
    for (const node of columnNodes) {
      const nodeValue = Math.max(outTotals.get(node.id) ?? 0, inTotals.get(node.id) ?? 0, 1);
      const height = Math.max(((HEIGHT - PADDING * 2) * nodeValue) / totalValue, 18);
      layoutNodes.push({ ...node, column: columns.get(node.id) ?? 0, y: yCursor, height });
      yCursor += height + 10;
    }
  }

  const nodeMap = new Map(layoutNodes.map((node) => [node.id, node]));
  const xForColumn = (column: number) =>
    PADDING + (column / Math.max(maxColumn, 1)) * (WIDTH - PADDING * 2 - NODE_WIDTH);

  const paths: string[] = [];
  for (const link of links) {
    const source = nodeMap.get(link.source);
    const target = nodeMap.get(link.target);
    if (!source || !target) {
      continue;
    }
    const sourceTotal = outTotals.get(link.source) ?? link.value;
    const linkHeight = Math.max((source.height * link.value) / sourceTotal, 4);
    const x1 = xForColumn(source.column) + NODE_WIDTH;
    const x2 = xForColumn(target.column);
    const y1 = source.y + source.height / 2 - linkHeight / 2;
    const y2 = target.y + target.height / 2 - linkHeight / 2;
    const midX = (x1 + x2) / 2;
    paths.push(
      `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2} L ${x2} ${y2 + linkHeight} C ${midX} ${y2 + linkHeight}, ${midX} ${y1 + linkHeight}, ${x1} ${y1 + linkHeight} Z`,
    );
  }

  return { layoutNodes, paths };
}

@Component({
  selector: 'da-journey-sankey-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="rd-chart-sankey" data-testid="rd-chart-sankey" role="img" [attr.aria-label]="chartTitle()">
      <header class="rd-chart-sankey__header">
        <span>{{ chartTitle() }}</span>
      </header>
      <div class="rd-chart-sankey__body">
        <svg [attr.viewBox]="'0 0 ' + width + ' ' + height" class="rd-chart-sankey__svg" aria-hidden="true">
          @for (path of layout().paths; track $index) {
            <path [attr.d]="path" class="rd-chart-sankey__link" />
          }
          @for (node of layout().layoutNodes; track node.id) {
            <g>
              <rect
                [attr.x]="xForColumn(node.column)"
                [attr.y]="node.y"
                [attr.width]="nodeWidth"
                [attr.height]="node.height"
                class="rd-chart-sankey__node"
                rx="2"
              />
              <text
                [attr.x]="xForColumn(node.column) + (node.column === maxColumn() ? nodeWidth + 6 : -6)"
                [attr.y]="node.y + node.height / 2"
                class="rd-chart-sankey__label"
                [attr.text-anchor]="node.column === maxColumn() ? 'start' : 'end'"
                dominant-baseline="middle"
              >
                {{ node.label }}
              </text>
            </g>
          }
        </svg>
      </div>
    </section>
  `,
})
export class JourneySankeyChartComponent {
  readonly chartTitle = input('Journey flow', { alias: 'title' });
  readonly nodes = input<SankeyNode[]>([]);
  readonly links = input<SankeyLink[]>([]);

  readonly width = WIDTH;
  readonly height = HEIGHT;
  readonly nodeWidth = NODE_WIDTH;

  readonly layout = computed(() => buildLayout(this.nodes(), this.links()));

  readonly maxColumn = computed(() =>
    Math.max(...this.layout().layoutNodes.map((node) => node.column), 0),
  );

  xForColumn(column: number): number {
    return PADDING + (column / Math.max(this.maxColumn(), 1)) * (WIDTH - PADDING * 2 - NODE_WIDTH);
  }
}
