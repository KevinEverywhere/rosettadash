import { EquirectViewport } from '@rosettadash/react/visual/media/equirect-viewport';
import { VideoMetadataPanel } from '@rosettadash/react/visual/media/video-metadata';
import { VideoSource } from '@rosettadash/react/visual/media/video-source';
import { YoutubeEmbed } from '@rosettadash/react/visual/media/youtube-embed';
import { WasmMedia } from '@rosettadash/react/visual/wasm/media';
import { SelectInput } from '@rosettadash/react/visual/input/select';
import { getDestinationById, MOCK_DESTINATIONS } from '@destination-atlas';
import type { AtlasContext } from '../state/useDestinationAtlasState';
import { localizedDestinationName } from '../lib/atlas-utils';

export const MEDIA_SOURCE = `<MediaScreen selectedId={selectedId}>
  <SelectInput label="Destination video" value={selectedId} />
  <YoutubeEmbed videoId={selected.youtubeId} controls />
  <VideoMetadataPanel items={flatVideoMetadata} />
  {is360 ? (
    <>
      <EquirectViewport label="360° viewport" … />
      <WasmMedia label="Wasm extract (demo)" … />
    </>
  ) : null}
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
      <p>
        Standard destination video with characteristics panel. 360° crop and wasm tooling appear only when
        the asset is marked equirectangular.
      </p>
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
          <VideoSource label="Local / file video source" accept="video/*" />
        </div>
      </div>

      {is360 && selected ? (
        <section className="rd-media-360">
          <h3 className="rd-media-360__title">360° tooling</h3>
          <p className="da-note">
            This destination is tagged as equirectangular
            {selected.equirectUrl ? (
              <>
                {' '}
                (<code>{selected.equirectUrl}</code>)
              </>
            ) : null}
            .
          </p>
          <div className="rd-media-360__grid">
            <EquirectViewport
              label="360° crop metadata"
              previewMode="rectilinear"
              yaw={25}
              pitch={-8}
              horizontalFov={75}
              outputWidth={1280}
              outputHeight={720}
            />
            <WasmMedia
              label="Wasm extract (demo)"
              operation="extract"
              extractionMode="flat-crop"
              showProgress
            />
          </div>
        </section>
      ) : selected ? (
        <p className="da-note">
          Flat video — no 360° panels. Tag <code>videoProjection: &apos;equirect&apos;</code> on a
          destination to enable immersive tooling.
        </p>
      ) : null}
    </section>
  );
}
