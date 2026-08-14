import { EquirectViewport } from '@rosettadash/react/visual/media/equirect-viewport';
import { VideoSource } from '@rosettadash/react/visual/media/video-source';
import { YoutubeEmbed } from '@rosettadash/react/visual/media/youtube-embed';
import { WasmMedia } from '@rosettadash/react/visual/wasm/media';
import { SelectInput } from '@rosettadash/react/visual/input/select';
import { getDestinationById, MOCK_DESTINATIONS } from '@destination-atlas';
import type { AtlasContext } from '../state/useDestinationAtlasState';
import { localizedDestinationName } from '../lib/atlas-utils';

type Props = Pick<AtlasContext, 'locale' | 'selectedId' | 'setSelectedId'>;

export function MediaScreen({ locale, selectedId, setSelectedId }: Props) {
  const videoDestinations = MOCK_DESTINATIONS.filter((dest) => dest.youtubeId);
  const selected = getDestinationById(selectedId);

  return (
    <section className="da-panel">
      <h2>Media</h2>
      <p>Destination video, program source, 360° crop metadata, and wasm extract demo.</p>
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
          className="da-youtube"
          videoId={selected.youtubeId}
          title={`${localizedDestinationName(selected, locale)} — destination video`}
          controls
        />
      ) : (
        <p className="da-note">Select a destination with a YouTube id.</p>
      )}
      <VideoSource label="Local / file video source" accept="video/*" />
      <EquirectViewport
        label="360° crop metadata"
        previewMode="rectilinear"
        yaw={25}
        pitch={-8}
        horizontalFov={75}
        outputWidth={1280}
        outputHeight={720}
      />
      <WasmMedia label="Wasm extract (demo)" operation="extract" extractionMode="flat-crop" showProgress />
      {selected?.equirectUrl ? (
        <p className="da-note">
          Sample equirect asset for {localizedDestinationName(selected, locale)}:{' '}
          <code>{selected.equirectUrl}</code>
        </p>
      ) : null}
    </section>
  );
}
