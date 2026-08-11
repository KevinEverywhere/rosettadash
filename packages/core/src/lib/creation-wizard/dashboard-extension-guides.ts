/** Contextual help for extending an in-progress dashboard (beyond starter templates). */

export interface DashboardExtensionTopic {
  id: string;
  title: string;
  summary: string;
  paletteGroups: string[];
  steps: string[];
  /** Optional AI assist prompt seed — distinct from the creation guide itself */
  aiPromptHint?: string;
}

export const DASHBOARD_EXTENSION_TOPICS: DashboardExtensionTopic[] = [
  {
    id: 'add-table',
    title: 'Add another table (e.g. personnel)',
    summary:
      'Starter dashboards often ship one table. Add more rowsets when you need personnel, inventory, or a second fact table.',
    paletteGroups: ['data-display', 'data-sources'],
    steps: [
      'Open Data Display (green) and add another Table, or duplicate your existing table node.',
      'Add or reuse a PostgreSQL data source under Data Sources — set a different table name (e.g. personnel).',
      'Bind the source rowset output to the new table data input.',
      'Use a Collapsible section (Layout, cyan) to group personnel separately from sales rows.',
    ],
    aiPromptHint:
      'Add a personnel table backed by PostgreSQL and bind it alongside my existing sales table.',
  },
  {
    id: 'cross-ref-sales',
    title: 'Cross-reference salespeople, orders, and profit',
    summary:
      'Link filters and KPIs so one salesperson selection drives orders, revenue, and margin.',
    paletteGroups: ['form-inputs', 'data-display', 'charts'],
    steps: [
      'Add a Select or Text filter for salesperson (Form Inputs, blue) at the top of the canvas.',
      'Bind the same filter range or salesperson value to your orders table and profit KPI.',
      'Add a Detail panel (Data Display) fed by table rowSelect to drill into one order.',
      'Optional: add a bar chart (Charts, amber) grouped by salesperson using the same bindings.',
    ],
    aiPromptHint:
      'Wire a salesperson filter to my orders table and profit KPIs so they stay in sync.',
  },
  {
    id: 'add-ons-map',
    title: 'Where expectable add-ons live',
    summary:
      'After a starter template lands well, these palette groups are the usual next layers.',
    paletteGroups: [
      'layout',
      'access-onboarding',
      'logic-motion',
      'data-sources',
      'plugin-extensions',
      'wasm-compute',
    ],
    steps: [
      'Layout & Navigation — Collapsible sections, tabs, modals to organize growing dashboards.',
      'Access & Onboarding — role gates and invite flows when dashboards become multi-user.',
      'Logic & Motion — timers and skeleton loaders for live or slow data.',
      'Data Sources / API Servers — additional PostgreSQL tables, MongoDB, or Nest/Express routes.',
      'Plugin Extensions & WASM Compute — custom badges, media pipelines, and compute when you outgrow mock data.',
    ],
  },
];

export function listDashboardExtensionTopics(): DashboardExtensionTopic[] {
  return DASHBOARD_EXTENSION_TOPICS;
}

export function getDashboardExtensionTopic(id: string): DashboardExtensionTopic | undefined {
  return DASHBOARD_EXTENSION_TOPICS.find((topic) => topic.id === id);
}
