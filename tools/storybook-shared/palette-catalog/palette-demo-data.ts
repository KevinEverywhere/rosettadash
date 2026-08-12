/** Mock rowsets and options for palette catalog demos (Storybook). */

export const selectOptions = [
  { label: 'North America', value: 'na' },
  { label: 'Europe', value: 'eu' },
  { label: 'Asia Pacific', value: 'apac' },
  { label: 'Latin America', value: 'latam' },
];

export const roleOptions = [
  { label: 'Viewer', value: 'viewer' },
  { label: 'Editor', value: 'editor' },
  { label: 'Admin', value: 'admin' },
];

export const timePresetOptions = [
  { id: 'last-7-days', label: 'Last 7 days' },
  { id: 'last-30-days', label: 'Last 30 days' },
  { id: 'qtd', label: 'Quarter to date' },
  { id: 'ytd', label: 'Year to date' },
];

export interface DemoTableRow {
  id: string;
  name: string;
  status: string;
  amount: number;
  date: string;
}

export const tableRows: DemoTableRow[] = [
  { id: '1', name: 'Acme Corp', status: 'Active', amount: 12400, date: '2026-08-01' },
  { id: '2', name: 'Globex LLC', status: 'Pending', amount: 8900, date: '2026-08-03' },
  { id: '3', name: 'Initech', status: 'Active', amount: 15250, date: '2026-08-05' },
  { id: '4', name: 'Umbrella Co', status: 'Paused', amount: 4200, date: '2026-08-07' },
  { id: '5', name: 'Stark Industries', status: 'Active', amount: 22100, date: '2026-08-09' },
  { id: '6', name: 'Wayne Enterprises', status: 'Active', amount: 18750, date: '2026-08-10' },
];

export interface DemoNewsRow {
  id: string;
  headline: string;
  source: string;
  region: string;
  publishedAt: string;
  summary: string;
  url: string;
}

export const newsRows: DemoNewsRow[] = [
  {
    id: 'n1',
    headline: 'Global markets react to policy shift',
    source: 'Reuters',
    region: 'Global',
    publishedAt: '2026-08-11',
    summary: 'Analysts weigh impacts across sectors as central banks signal coordinated action.',
    url: 'https://example.com/news/1',
  },
  {
    id: 'n2',
    headline: 'Regional energy grid completes upgrade',
    source: 'AP',
    region: 'North America',
    publishedAt: '2026-08-10',
    summary: 'The multi-year modernization project improves resilience ahead of peak demand.',
    url: 'https://example.com/news/2',
  },
  {
    id: 'n3',
    headline: 'Tech consortium publishes open media spec',
    source: 'Bloomberg',
    region: 'Europe',
    publishedAt: '2026-08-09',
    summary: 'The draft standard targets interoperable 360° authoring and playback pipelines.',
    url: 'https://example.com/news/3',
  },
  {
    id: 'n4',
    headline: 'Shipping lanes report record throughput',
    source: 'Financial Times',
    region: 'Asia Pacific',
    publishedAt: '2026-08-08',
    summary: 'Port operators cite automation and expanded berth capacity as growth drivers.',
    url: 'https://example.com/news/4',
  },
  {
    id: 'n5',
    headline: 'City pilots immersive transit dashboards',
    source: 'Local Desk',
    region: 'North America',
    publishedAt: '2026-08-07',
    summary: 'Operators use equirect program feeds for platform situational awareness.',
    url: 'https://example.com/news/5',
  },
];

export const chartPoints = [
  { label: 'Mon', value: 42 },
  { label: 'Tue', value: 58 },
  { label: 'Wed', value: 51 },
  { label: 'Thu', value: 73 },
  { label: 'Fri', value: 64 },
  { label: 'Sat', value: 38 },
];

export const pieSlices = [
  { label: 'Direct', value: 42, color: '#38bdf8' },
  { label: 'Organic', value: 28, color: '#818cf8' },
  { label: 'Referral', value: 18, color: '#34d399' },
  { label: 'Paid', value: 12, color: '#fbbf24' },
];

export const lineChartPoints = '0,80 40,62 80,48 120,56 160,34 200,42 240,24';

export const DEFAULT_INLINE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>';

export const DEFAULT_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/></svg>';
