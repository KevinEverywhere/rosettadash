import { TimePreset } from '@rosettadash/react/domain/time-preset';
import { DateRangeFilter } from '@rosettadash/react/visual/input/date-range';
import { SelectInput } from '@rosettadash/react/visual/input/select';
import { TextInput } from '@rosettadash/react/visual/input/text';
import { DetailPanel } from '@rosettadash/react/visual/detail';
import { DataTable, type DataTableRow } from '@rosettadash/react/visual/table';
import { MOCK_DESTINATIONS, formatVisitorCount, getDestinationById } from '@destination-atlas';
import type { AtlasContext } from '../state/useDestinationAtlasState';
import { localizedDestinationName } from '../lib/atlas-utils';

const REGION_OPTIONS = [
  { value: 'asia-pacific', label: 'Asia Pacific' },
  { value: 'europe', label: 'Europe' },
  { value: 'americas', label: 'Americas' },
  { value: 'africa', label: 'Africa' },
];

type Props = Pick<
  AtlasContext,
  | 'locale'
  | 'selectedId'
  | 'setSelectedId'
  | 'destSearch'
  | 'setDestSearch'
  | 'destRegion'
  | 'setDestRegion'
  | 'timePreset'
  | 'setTimePreset'
>;

export function DestinationsScreen({
  locale,
  selectedId,
  setSelectedId,
  destSearch,
  setDestSearch,
  destRegion,
  setDestRegion,
  timePreset,
  setTimePreset,
}: Props) {
  const filtered = MOCK_DESTINATIONS.filter((dest) => {
    const name = localizedDestinationName(dest, locale).toLowerCase();
    const matchesSearch = !destSearch || name.includes(destSearch.toLowerCase());
    const matchesRegion = !destRegion || dest.region === destRegion;
    return matchesSearch && matchesRegion;
  });

  const rows: DataTableRow[] = filtered.map((dest) => ({
    id: dest.id,
    name: localizedDestinationName(dest, locale),
    status: dest.region,
    amount: dest.visitorsCurrent,
    date: '2024',
  }));

  const selected = getDestinationById(selectedId);

  return (
    <section className="da-panel">
      <h2>Destinations</h2>
      <p>Browse and filter mock destination records.</p>
      <div className="da-stack">
        <div className="da-stack da-stack--2">
          <TextInput
            label="Search"
            placeholder="Destination name…"
            value={destSearch}
            onChange={setDestSearch}
          />
          <SelectInput
            label="Region"
            placeholder="All regions"
            options={REGION_OPTIONS}
            value={destRegion}
            onChange={setDestRegion}
          />
        </div>
        <div className="da-stack da-stack--2">
          <DateRangeFilter label="Visit period" startDate="2019-01-01" endDate="2024-12-31" />
          <TimePreset
            label="Historic window"
            presets={[
              { id: '1y', label: '1Y' },
              { id: '5y', label: '5Y' },
              { id: 'all', label: 'All' },
            ]}
            activePresetId={timePreset}
            onPresetChange={setTimePreset}
          />
        </div>
        <DataTable
          title="Destinations"
          rows={rows}
        />
        <SelectInput
          label="Selected row"
          placeholder="Choose destination…"
          options={filtered.map((dest) => ({
            value: dest.id,
            label: localizedDestinationName(dest, locale),
          }))}
          value={selectedId}
          onChange={setSelectedId}
        />
        <DetailPanel title="Destination detail" emptyMessage="">
          {selected ? (
            <div className="da-detail-body">
              <p>
                <strong>{localizedDestinationName(selected, locale)}</strong> — {selected.region}
              </p>
              <p>
                Current visitors: {formatVisitorCount(selected.visitorsCurrent)} (2024)
              </p>
              <p>
                Historic:{' '}
                {selected.visitorsHistoric
                  .map((row) => `${row.year}: ${formatVisitorCount(row.visitors)}`)
                  .join(' · ')}
              </p>
              <p>
                Coordinates: {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
              </p>
            </div>
          ) : (
            <p className="da-detail-body">Select a destination to view details.</p>
          )}
        </DetailPanel>
      </div>
    </section>
  );
}
