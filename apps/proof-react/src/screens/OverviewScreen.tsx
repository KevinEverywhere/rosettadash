import { BarChart } from '@rosettadash/react/visual/chart/bar';
import { LineChart } from '@rosettadash/react/visual/chart/line';
import { GridLayout } from '@rosettadash/react/layout/grid';
import { KpiCard } from '@rosettadash/react/visual/kpi';
import { MetricChip } from '@rosettadash/react/visual/plugin/metric-chip';
import { StatusBadge } from '@rosettadash/react/visual/plugin/status-badge';
import { MOCK_DESTINATIONS, formatVisitorCount } from '@destination-atlas';
import type { AtlasContext } from '../state/useDestinationAtlasState';
import { computeVisitorDelta, localizedDestinationName } from '../lib/atlas-utils';

export function OverviewScreen({ locale }: Pick<AtlasContext, 'locale'>) {
  return (
    <section className="da-panel">
      <h2>Overview</h2>
      <p>Current visitor KPIs and historic trends across sample destinations.</p>
      <div className="da-stack">
        <GridLayout columns={3} gap={12} title="Destination KPIs">
          {MOCK_DESTINATIONS.map((dest) => (
            <KpiCard
              key={dest.id}
              title={localizedDestinationName(dest, locale)}
              value={formatVisitorCount(dest.visitorsCurrent)}
              delta={computeVisitorDelta(dest)}
              format="number"
            />
          ))}
        </GridLayout>
        <div className="da-stack da-stack--2">
          <LineChart title="Visitors over time (aggregate trend)" />
          <BarChart title="2024 visitors by destination" />
        </div>
        <div className="da-stack da-stack--2">
          <MetricChip chipLabel="Avg. stay" chipValue="4.2 nights" />
          <StatusBadge statusText="Data freshness: current" tone="success" />
        </div>
      </div>
    </section>
  );
}
