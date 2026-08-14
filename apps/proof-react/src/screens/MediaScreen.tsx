import { YoutubeEmbed } from '@rosettadash/react/visual/media/youtube-embed';
import { VideoMetadataPanel } from '@rosettadash/react/visual/media/video-metadata';
import { SelectInput } from '@rosettadash/react/visual/input/select';
import { getDestinationById, MOCK_DESTINATIONS } from '@destination-atlas';
import type { AtlasContext } from '../state/useDestinationAtlasState';
import { localizedDestinationName } from '../lib/atlas-utils';

export const MEDIA_SOURCE = `<MediaScreen selectedId={selectedId}>
  <SelectInput label="Destination video" value={selectedId} />
  <YoutubeEmbed videoId={selected.youtubeId} controls />
  <VideoMetadataPanel items={videoMetadata} />
</MediaScreen>`;

type Props = Pick<AtlasContext, 'locale' | 'selectedId' | 'setSelectedId'>;

function isEquirectVideo(dest: ReturnType<typeof getDestinationById>): boolean {
  return dest?.videoProjection === 'equirect' || Boolean(dest?.equirectUrl);
}

export function MediaScreen({ locale, selectedId, setSelectedId }: Props) {
  const videoDestinations = MOCK_DESTINATIONS.filter((dest) => dest.youtubeId);
  const selected = getDestinationById(selectedId);
  const is360 = isEquirectVideo(selected);

  const metadataItems = selected
    ? [
        { label: 'Destination', value: localizedDestinationName(selected, locale) },
        { label: 'Source', value: selected.youtubeId ? 'YouTube embed' : 'None' },
        {
          label: 'Projection',
          value: is360 ? 'Equirectangular (360°)' : 'Flat / standard',
        },
        { label: 'Video id', value: selected.youtubeId ?? '—' },
        { label: 'Region', value: selected.region },
      ]
    : [];

  return (
    <section className="da-panel">
      <h2>Media</h2>
      <p>Browse and watch destination videos. Upload, crop, and WASM extract live on the Authoring tab.</p>
      <div className="rd-media-layout">
        <div className="rd-media-primary">
          <SelectInput
            label="Destination video"
            options={videoDestinations.map((dest) => ({
              value: dest.id,
              label: localizedDestinationName(dest, locale),
            }))}
            value={selectedId}
            onChange={setSelectedId}
          />
          {selected?.youtubeId ? (
            <YoutubeEmbed
              className="rd-youtube-embed-host"
              videoId={selected.youtubeId}
              title={`${localizedDestinationName(selected, locale)} — destination video`}
              controls
            />
          ) : (
            <p className="da-note">Select a destination with a YouTube id.</p>
          )}
        </div>
        <div className="rd-media-tools">
          <VideoMetadataPanel items={metadataItems} />
        </div>
      </div>
      {is360 && selected?.equirectUrl ? (
        <p className="da-note">
          This destination has equirect metadata (<code>{selected.equirectUrl}</code>). Use{' '}
          <strong>Authoring</strong> to load a local 360° file and run ffmpeg.wasm extract.
        </p>
      ) : null}
    </section>
  );
}
